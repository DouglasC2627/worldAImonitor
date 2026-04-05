#!/usr/bin/env node

/**
 * Seed AI policy and governance tracker.
 *
 * Sources:
 *  - AI Now Institute RSS
 *  - Future of Life Institute RSS
 *  - NIST AI news RSS
 *  - Partnership on AI blog RSS
 *  - OECD AI Policy Observatory RSS
 *
 * Redis keys written:
 *   ai-policy:events:v1    — policy events (TTL 12h)
 */

import { loadEnvFile, CHROME_UA, runSeed, sleep } from './_seed-utils.mjs';

loadEnvFile(import.meta.url);

const POLICY_TTL = 43200; // 12h

const POLICY_FEEDS = [
  { url: 'https://ainowinstitute.org/feed', name: 'AI Now Institute', jurisdiction: 'US' },
  { url: 'https://futureoflife.org/feed/', name: 'Future of Life Institute', jurisdiction: 'International' },
  { url: 'https://www.nist.gov/blogs/cybersecurity-insights/rss.xml', name: 'NIST', jurisdiction: 'US' },
  { url: 'https://partnershiponai.org/feed/', name: 'Partnership on AI', jurisdiction: 'International' },
  { url: 'https://oecd.ai/feed', name: 'OECD AI Policy', jurisdiction: 'International' },
  { url: 'https://www.gov.uk/search/news-and-communications.atom?keywords=artificial+intelligence&organisations=department-for-science-innovation-and-technology', name: 'UK DSIT', jurisdiction: 'UK' },
  { url: 'https://hai.stanford.edu/feed', name: 'Stanford HAI', jurisdiction: 'US' },
];

const POLICY_KEYWORDS = [
  'regulation', 'policy', 'governance', 'law', 'act', 'executive order',
  'rule', 'guideline', 'framework', 'safety', 'risk', 'compliance',
  'oversight', 'liability', 'copyright', 'export', 'ban', 'restriction',
];

const SEVERITY_HIGH = ['executive order', 'act passed', 'legislation', 'ban', 'export control', 'mandatory'];
const SEVERITY_SIGNIFICANT = ['regulation', 'policy', 'framework', 'guideline', 'proposed rule'];

function detectSeverity(text) {
  const lower = text.toLowerCase();
  if (SEVERITY_HIGH.some(k => lower.includes(k))) return 'landmark';
  if (SEVERITY_SIGNIFICANT.some(k => lower.includes(k))) return 'significant';
  return 'procedural';
}

function detectJurisdiction(text, feedJurisdiction) {
  const lower = text.toLowerCase();
  if (lower.includes('european union') || lower.includes('eu ai act') || lower.includes('brussels')) return 'EU';
  if (lower.includes('congress') || lower.includes('white house') || lower.includes('federal') || lower.includes('ftc') || lower.includes('nist')) return 'US';
  if (lower.includes('parliament') && lower.includes('uk')) return 'UK';
  if (lower.includes('china') || lower.includes('beijing') || lower.includes('cyberspace administration')) return 'China';
  return feedJurisdiction || 'International';
}

async function fetchPolicyFeed(feed) {
  try {
    const resp = await fetch(feed.url, {
      headers: { 'User-Agent': CHROME_UA, Accept: 'application/rss+xml, application/atom+xml, text/xml, */*' },
      signal: AbortSignal.timeout(10_000),
    });
    if (!resp.ok) { console.warn(`  ${feed.name}: HTTP ${resp.status}`); return []; }
    const xml = await resp.text();

    const events = [];
    // Support both RSS <item> and Atom <entry>
    const itemPattern = /<(?:item|entry)>([\s\S]*?)<\/(?:item|entry)>/g;
    for (const m of xml.matchAll(itemPattern)) {
      const block = m[1];
      const title = (block.match(/<title[^>]*><!\[CDATA\[(.*?)\]\]><\/title>|<title[^>]*>(.*?)<\/title>/s)?.[1] ||
                     block.match(/<title[^>]*>(.*?)<\/title>/s)?.[1] || '').replace(/<[^>]+>/g, '').trim();
      const link = block.match(/<link>(.*?)<\/link>/)?.[1]?.trim() ||
                   block.match(/<link[^>]+href="([^"]+)"/)?.[1]?.trim() || '';
      const pubDate = block.match(/<pubDate>(.*?)<\/pubDate>/)?.[1]?.trim() ||
                      block.match(/<published>(.*?)<\/published>/)?.[1]?.trim() || '';
      const desc = (block.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)?.[1] ||
                    block.match(/<description>([\s\S]*?)<\/description>/)?.[1] ||
                    block.match(/<content[^>]*>([\s\S]*?)<\/content>/)?.[1] || '').replace(/<[^>]+>/g, '').trim().slice(0, 400);

      if (!title) continue;
      const combined = `${title} ${desc}`.toLowerCase();
      if (!POLICY_KEYWORDS.some(k => combined.includes(k))) continue;
      if (!combined.includes('ai') && !combined.includes('artificial intelligence') && !combined.includes('machine learning') && !combined.includes('algorithm')) continue;

      events.push({
        id: `${feed.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Buffer.from(title).toString('base64').slice(0, 12)}`,
        title,
        source: feed.name,
        jurisdiction: detectJurisdiction(combined, feed.jurisdiction),
        severity: detectSeverity(combined),
        status: 'unknown',
        date: pubDate,
        url: link,
        description: desc,
      });
    }
    console.log(`  ${feed.name}: ${events.length} policy events`);
    return events;
  } catch (e) {
    console.warn(`  ${feed.name}: ${e.message}`);
    return [];
  }
}

async function fetchAll() {
  const results = [];
  for (const feed of POLICY_FEEDS) {
    const events = await fetchPolicyFeed(feed);
    results.push(...events);
    await sleep(300);
  }

  // Deduplicate by title
  const seen = new Set();
  const deduped = results.filter(e => {
    const key = e.title.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 40);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort: landmark first, then by date desc
  const severityOrder = { landmark: 0, significant: 1, procedural: 2 };
  deduped.sort((a, b) => {
    const sv = (severityOrder[a.severity] ?? 2) - (severityOrder[b.severity] ?? 2);
    if (sv !== 0) return sv;
    return (b.date || '').localeCompare(a.date || '');
  });

  console.log(`  AI policy events total: ${deduped.length}`);
  if (deduped.length === 0) throw new Error('No AI policy data fetched');

  return { events: deduped, fetchedAt: Date.now() };
}

function validate(data) {
  return Array.isArray(data?.events) && data.events.length > 0;
}

runSeed('ai-policy', 'events', 'ai-policy:events:v1', fetchAll, {
  validateFn: validate,
  ttlSeconds: POLICY_TTL,
  sourceVersion: 'ai-policy-v1',
}).catch((err) => {
  const cause = err.cause ? ` (cause: ${err.cause.message || err.cause.code || err.cause})` : '';
  console.error('FATAL:', (err.message || err) + cause);
  process.exit(1);
});
