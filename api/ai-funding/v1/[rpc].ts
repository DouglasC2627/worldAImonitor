export const config = { runtime: 'edge' };

/**
 * AI Funding rounds API — serves data seeded by seed-ai-funding.mjs.
 *
 * GET /api/ai-funding/v1/rounds   → { rounds: FundingRound[], fetchedAt: number }
 */

import { getCachedJson } from '../../../server/_shared/redis';

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const rpc = url.pathname.split('/').pop() || '';

  if (rpc !== 'rounds') {
    return new Response(JSON.stringify({ error: 'Unknown RPC', rpc }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const data = await getCachedJson('ai-funding:rounds:v1', true);
    if (!data) {
      return new Response(JSON.stringify({ rounds: [], fetchedAt: 0 }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=600, stale-while-revalidate=1800' },
      });
    }
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=600, stale-while-revalidate=1800' },
    });
  } catch (err) {
    console.error('[ai-funding/v1]', err);
    return new Response(JSON.stringify({ rounds: [], error: 'upstream error' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
