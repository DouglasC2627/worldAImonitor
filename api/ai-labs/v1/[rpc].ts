export const config = { runtime: 'edge' };

/**
 * AI Labs intelligence API — serves data seeded by seed-ai-labs.mjs.
 *
 * GET /api/ai-labs/v1/profiles   → { profiles: AILabProfile[], fetchedAt: number }
 */

import { getCachedJson } from '../../../server/_shared/redis';

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const rpc = url.pathname.split('/').pop() || '';

  if (rpc !== 'profiles') {
    return new Response(JSON.stringify({ error: 'Unknown RPC', rpc }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const data = await getCachedJson('ai-labs:profiles:v1', true);
    if (!data) {
      return new Response(JSON.stringify({ profiles: [], fetchedAt: 0 }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=600, stale-while-revalidate=3600' },
      });
    }
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=600, stale-while-revalidate=3600' },
    });
  } catch (err) {
    console.error('[ai-labs/v1]', err);
    return new Response(JSON.stringify({ profiles: [], error: 'upstream error' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
