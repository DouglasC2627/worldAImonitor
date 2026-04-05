#!/usr/bin/env node

/**
 * Seed AI funding rounds for the AI variant.
 *
 * Data sources (in priority order):
 *  1. Crunchbase Daily CSV export (if CRUNCHBASE_API_KEY is configured)
 *  2. TechCrunch AI/funding RSS feed (public, no key required)
 *  3. VentureBeat AI funding RSS feed (public, no key required)
 *
 * Redis keys written:
 *   ai-funding:rounds:v1   — funding rounds (TTL 12h)
 */

import { loadEnvFile, CHROME_UA, runSeed, sleep } from './_seed-utils.mjs';

loadEnvFile(import.meta.url);

const FUNDING_TTL = 43200; // 12h

// ─── Crunchbase (optional — requires API key) ───

async function fetchCrunchbaseRounds() {
  const apiKey = process.env.CRUNCHBASE_API_KEY;
  if (!apiKey) {
    console.log('  Crunchbase: no API key — skipping');
    return [];
  }

  const cutoff = new Date(Date.now() - 30 * 86400_000).toISOString().split('T')[0];
  const body = {
    field_ids: ['identifier', 'announced_on', 'investment_type', 'money_raised', 'investor_identifiers', 'funded_organization_identifier', 'funded_organization_categories'],
    query: [
      { type: 'predicate', field_id: 'announced_on', operator_id: 'gte', values: [cutoff] },
      { type: 'predicate', field_id: 'funded_organization_categories', operator_id: 'includes', values: ['artificial_intelligence'] },
    ],
    order: [{ field_id: 'announced_on', sort: 'desc' }],
    limit: 100,
  };

  try {
    const resp = await fetch(`https://api.crunchbase.com/api/v4/searches/funding_rounds?user_key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'User-Agent': CHROME_UA },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(20_000),
    });
    if (!resp.ok) { console.warn(`  Crunchbase: HTTP ${resp.status}`); return []; }
    const data = await resp.json();
    const entities = data?.entities ?? [];
    console.log(`  Crunchbase: ${entities.length} AI funding rounds`);
    return entities.map(e => {
      const p = e.properties ?? {};
      return {
        company: p.funded_organization_identifier?.value || '',
        round: p.investment_type || '',
        amount: p.money_raised?.value_usd ?? 0,
        amountFormatted: p.money_raised?.value_usd
          ? formatAmount(p.money_raised.value_usd)
          : '',
        investors: (p.investor_identifiers ?? []).map(i => i.value || '').filter(Boolean),
        date: p.announced_on || '',
        source: 'crunchbase',
        url: `https://www.crunchbase.com/funding_round/${e.identifier?.value || ''}`,
      };
    }).filter(r => r.company && r.date);
  } catch (e) {
    console.warn(`  Crunchbase: ${e.message}`);
    return [];
  }
}

// ─── RSS feed fallback ───

function formatAmount(usd) {
  if (!usd) return '';
  if (usd >= 1_000_000_000) return `$${(usd / 1_000_000_000).toFixed(1)}B`;
  if (usd >= 1_000_000) return `$${Math.round(usd / 1_000_000)}M`;
  if (usd >= 1_000) return `$${Math.round(usd / 1_000)}K`;
  return `$${usd}`;
}

const AMOUNT_PATTERN = /\$(\d+(?:\.\d+)?)\s*(billion|million|[BMK])/i;
const ROUND_KEYWORDS = ['seed', 'series a', 'series b', 'series c', 'growth', 'pre-seed'];

function parseRssItem(block) {
  const title = (block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/)?.[1] ||
                 block.match(/<title>(.*?)<\/title>/)?.[1] || '').trim();
  const link = block.match(/<link>(.*?)<\/link>/)?.[1]?.trim() ||
               block.match(/<link[^>]+href="([^"]+)"/)?.[1]?.trim() || '';
  const pubDate = block.match(/<pubDate>(.*?)<\/pubDate>/)?.[1]?.trim() || '';
  const desc = (block.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)?.[1] ||
                block.match(/<description>([\s\S]*?)<\/description>/)?.[1] || '').trim();

  if (!title) return null;

  const lower = title.toLowerCase();
  const hasRound = ROUND_KEYWORDS.some(k => lower.includes(k));
  const hasFunding = lower.includes('raises') || lower.includes('funding') || lower.includes('investment') || lower.includes('valuation');
  const hasAI = lower.includes('ai') || lower.includes('artificial intelligence') || lower.includes('machine learning') || lower.includes('llm') || lower.includes('model');
  if (!((hasRound || hasFunding) && hasAI)) return null;

  const amountMatch = (title + ' ' + desc).match(AMOUNT_PATTERN);
  let amount = 0;
  let amountFormatted = '';
  if (amountMatch) {
    const num = parseFloat(amountMatch[1]);
    const unit = amountMatch[2].toLowerCase();
    if (unit === 'billion' || unit === 'b') { amount = num * 1e9; amountFormatted = `$${num}B`; }
    else if (unit === 'million' || unit === 'm') { amount = num * 1e6; amountFormatted = `$${num}M`; }
    else if (unit === 'k') { amount = num * 1e3; amountFormatted = `$${num}K`; }
  }

  const roundType = ROUND_KEYWORDS.find(k => lower.includes(k)) || 'funding';
  return { company: '', title, round: roundType, amount, amountFormatted, investors: [], date: pubDate, link, source: 'rss' };
}

async function fetchFundingFromRss(url, sourceName) {
  try {
    const resp = await fetch(url, {
      headers: { 'User-Agent': CHROME_UA, Accept: 'application/rss+xml, text/xml, */*' },
      signal: AbortSignal.timeout(10_000),
    });
    if (!resp.ok) { console.warn(`  ${sourceName}: HTTP ${resp.status}`); return []; }
    const xml = await resp.text();
    const items = [];
    for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
      const parsed = parseRssItem(m[1]);
      if (parsed) items.push(parsed);
    }
    console.log(`  ${sourceName}: ${items.length} AI funding items`);
    return items;
  } catch (e) {
    console.warn(`  ${sourceName}: ${e.message}`);
    return [];
  }
}

// ─── Main ───

async function fetchAll() {
  const [crunchbase, techcrunch, venturebeatRes] = await Promise.allSettled([
    fetchCrunchbaseRounds(),
    fetchFundingFromRss('https://techcrunch.com/category/venture/feed/', 'TechCrunch'),
    fetchFundingFromRss('https://venturebeat.com/category/ai/feed/', 'VentureBeat'),
  ]);

  const crunchbaseRounds = crunchbase.status === 'fulfilled' ? crunchbase.value : [];
  const tcRounds = techcrunch.status === 'fulfilled' ? techcrunch.value : [];
  const vbRounds = venturebeatRes.status === 'fulfilled' ? venturebeatRes.value : [];

  // Deduplicate by title similarity, prefer Crunchbase data
  const seen = new Set();
  const rounds = [];

  for (const r of [...crunchbaseRounds, ...tcRounds, ...vbRounds]) {
    const key = (r.company || r.title || '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 30);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    rounds.push(r);
  }

  // Sort by amount desc, then by date desc
  rounds.sort((a, b) => {
    if (b.amount !== a.amount) return b.amount - a.amount;
    return (b.date || '').localeCompare(a.date || '');
  });

  console.log(`  AI funding rounds total: ${rounds.length} (deduplicated)`);
  if (rounds.length === 0) throw new Error('No AI funding data fetched');

  return { rounds, fetchedAt: Date.now() };
}

function validate(data) {
  return Array.isArray(data?.rounds) && data.rounds.length > 0;
}

runSeed('ai-funding', 'rounds', 'ai-funding:rounds:v1', fetchAll, {
  validateFn: validate,
  ttlSeconds: FUNDING_TTL,
  sourceVersion: 'ai-funding-v1',
}).catch((err) => {
  const cause = err.cause ? ` (cause: ${err.cause.message || err.cause.code || err.cause})` : '';
  console.error('FATAL:', (err.message || err) + cause);
  process.exit(1);
});
