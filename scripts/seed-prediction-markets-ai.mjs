#!/usr/bin/env node

/**
 * Seed AI prediction markets for the AI variant.
 *
 * Queries:
 *  - Polymarket (via Gamma API) — AI-tagged markets
 *  - Metaculus — questions tagged "artificial-intelligence"
 *  - Manifold Markets — AI-tagged markets
 *
 * Unified schema:
 *   { id, question, probability, volume, platform, resolveDate, url, category }
 *
 * Redis keys written:
 *   prediction:ai-markets:v1    — AI prediction markets (TTL 3h)
 */

import { loadEnvFile, CHROME_UA, runSeed, sleep } from './_seed-utils.mjs';

loadEnvFile(import.meta.url);

const MARKETS_TTL = 10800; // 3h

const AI_TAGS_POLYMARKET = ['artificial-intelligence', 'ai', 'openai', 'chatgpt', 'agi', 'llm', 'robots'];
const FETCH_TIMEOUT = 12_000;

// ─── Polymarket ───

async function fetchPolymarketAI() {
  const results = [];
  const seen = new Set();

  for (const tag of AI_TAGS_POLYMARKET) {
    const params = new URLSearchParams({
      tag_slug: tag,
      closed: 'false',
      active: 'true',
      archived: 'false',
      end_date_min: new Date().toISOString(),
      order: 'volume',
      ascending: 'false',
      limit: '20',
    });

    try {
      const resp = await fetch(`https://gamma-api.polymarket.com/events?${params}`, {
        headers: { Accept: 'application/json', 'User-Agent': CHROME_UA },
        signal: AbortSignal.timeout(FETCH_TIMEOUT),
      });
      if (!resp.ok) { console.warn(`  Polymarket [${tag}]: HTTP ${resp.status}`); continue; }
      const events = await resp.json();
      if (!Array.isArray(events)) continue;

      for (const event of events) {
        if (seen.has(event.id)) continue;
        seen.add(event.id);

        const markets = event.markets ?? [];
        const totalVolume = markets.reduce((s, m) => s + (parseFloat(m.volume) || 0), 0);
        const prob = markets.length === 1 ? (parseFloat(markets[0]?.outcomePrices?.[0]) || null) : null;

        results.push({
          id: `poly-${event.id}`,
          question: event.title || event.question || '',
          probability: prob,
          volume: totalVolume,
          platform: 'polymarket',
          resolveDate: event.endDate || '',
          url: `https://polymarket.com/event/${event.slug || event.id}`,
          category: 'ai',
        });
      }
    } catch (e) {
      console.warn(`  Polymarket [${tag}]: ${e.message}`);
    }
    await sleep(300);
  }

  console.log(`  Polymarket AI: ${results.length} markets`);
  return results;
}

// ─── Metaculus ───

async function fetchMetaculusAI() {
  try {
    const params = new URLSearchParams({
      search: 'artificial intelligence',
      status: 'active',
      order_by: '-activity',
      limit: '50',
      forecast_type: 'binary',
    });

    const resp = await fetch(`https://www.metaculus.com/api2/questions/?${params}`, {
      headers: { Accept: 'application/json', 'User-Agent': CHROME_UA },
      signal: AbortSignal.timeout(FETCH_TIMEOUT),
    });
    if (!resp.ok) { console.warn(`  Metaculus: HTTP ${resp.status}`); return []; }
    const data = await resp.json();
    const questions = data?.results ?? [];

    const AI_KEYWORDS = ['ai', 'artificial intelligence', 'gpt', 'llm', 'agi', 'robot', 'deepmind', 'openai', 'anthropic', 'language model', 'machine learning', 'neural'];

    const results = questions
      .filter(q => {
        const text = (q.title || q.question?.description || '').toLowerCase();
        return AI_KEYWORDS.some(k => text.includes(k));
      })
      .map(q => ({
        id: `metaculus-${q.id}`,
        question: q.title || '',
        probability: q.community_prediction?.full?.q2 ?? null,
        volume: q.number_of_forecasters ?? 0,
        platform: 'metaculus',
        resolveDate: q.resolve_time || q.close_time || '',
        url: `https://www.metaculus.com${q.page_url || `/questions/${q.id}`}`,
        category: 'ai',
      }));

    console.log(`  Metaculus AI: ${results.length} questions`);
    return results;
  } catch (e) {
    console.warn(`  Metaculus: ${e.message}`);
    return [];
  }
}

// ─── Manifold Markets ───

async function fetchManifoldAI() {
  try {
    const params = new URLSearchParams({
      term: 'AI',
      filter: 'open',
      sort: 'liquidity',
      limit: '50',
    });

    const resp = await fetch(`https://api.manifold.markets/v0/search-markets?${params}`, {
      headers: { Accept: 'application/json', 'User-Agent': CHROME_UA },
      signal: AbortSignal.timeout(FETCH_TIMEOUT),
    });
    if (!resp.ok) { console.warn(`  Manifold: HTTP ${resp.status}`); return []; }
    const markets = await resp.json();
    if (!Array.isArray(markets)) return [];

    const AI_KEYWORDS = ['ai', 'artificial intelligence', 'gpt', 'llm', 'agi', 'openai', 'anthropic', 'robot', 'language model'];

    const results = markets
      .filter(m => {
        const text = (m.question || '').toLowerCase();
        return AI_KEYWORDS.some(k => text.includes(k)) && m.outcomeType === 'BINARY';
      })
      .map(m => ({
        id: `manifold-${m.id}`,
        question: m.question || '',
        probability: m.probability ?? null,
        volume: m.totalLiquidity ?? 0,
        platform: 'manifold',
        resolveDate: m.closeTime ? new Date(m.closeTime).toISOString() : '',
        url: m.url || `https://manifold.markets/market/${m.slug}`,
        category: 'ai',
      }));

    console.log(`  Manifold AI: ${results.length} markets`);
    return results;
  } catch (e) {
    console.warn(`  Manifold: ${e.message}`);
    return [];
  }
}

// ─── Main ───

async function fetchAll() {
  const [polymarket, metaculus, manifold] = await Promise.allSettled([
    fetchPolymarketAI(),
    fetchMetaculusAI(),
    fetchManifoldAI(),
  ]);

  const polyData = polymarket.status === 'fulfilled' ? polymarket.value : [];
  const metaData = metaculus.status === 'fulfilled' ? metaculus.value : [];
  const manifoldData = manifold.status === 'fulfilled' ? manifold.value : [];

  // Combine and deduplicate by question text similarity
  const all = [...polyData, ...metaData, ...manifoldData];

  // Sort by volume (liquidity) descending
  all.sort((a, b) => (b.volume ?? 0) - (a.volume ?? 0));

  console.log(`  AI prediction markets total: ${all.length}`);
  if (all.length === 0) throw new Error('No AI prediction market data fetched');

  return { markets: all, fetchedAt: Date.now() };
}

function validate(data) {
  return Array.isArray(data?.markets) && data.markets.length > 0;
}

runSeed('prediction-ai', 'markets', 'prediction:ai-markets:v1', fetchAll, {
  validateFn: validate,
  ttlSeconds: MARKETS_TTL,
  sourceVersion: 'prediction-ai-v1',
}).catch((err) => {
  const cause = err.cause ? ` (cause: ${err.cause.message || err.cause.code || err.cause})` : '';
  console.error('FATAL:', (err.message || err) + cause);
  process.exit(1);
});
