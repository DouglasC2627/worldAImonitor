export const config = { runtime: 'edge' };

/**
 * AI Benchmarks leaderboard API — serves data seeded by seed-ai-benchmarks.mjs.
 *
 * GET /api/ai-benchmarks/v1/leaderboards   → { leaderboards: Leaderboard[], fetchedAt: number }
 * GET /api/ai-benchmarks/v1/sota-alerts    → { alerts: SOTAAlert[], fetchedAt: number }
 */

import { getCachedJson } from '../../../server/_shared/redis';

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const rpc = url.pathname.split('/').pop() || '';

  let key: string;
  if (rpc === 'leaderboards') {
    key = 'ai-benchmarks:leaderboards:v1';
  } else if (rpc === 'sota-alerts') {
    key = 'ai-benchmarks:sota-alerts:v1';
  } else {
    return new Response(JSON.stringify({ error: 'Unknown RPC', rpc }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const data = await getCachedJson(key, true);
    if (!data) {
      return new Response(JSON.stringify({ leaderboards: [], alerts: [], fetchedAt: 0 }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=600, stale-while-revalidate=3600' },
      });
    }
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=600, stale-while-revalidate=3600' },
    });
  } catch (err) {
    console.error('[ai-benchmarks/v1]', err);
    return new Response(JSON.stringify({ leaderboards: [], error: 'upstream error' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
