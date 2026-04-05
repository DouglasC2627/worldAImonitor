export const config = { runtime: 'edge' };

/**
 * HuggingFace activity API — serves model and space data seeded by seed-hf-models.mjs.
 *
 * GET /api/huggingface/v1/models   → { models: HFModel[], fetchedAt: number }
 * GET /api/huggingface/v1/spaces   → { spaces: HFSpace[], fetchedAt: number }
 */

import { getCachedJson } from '../../../server/_shared/redis';

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const rpc = url.pathname.split('/').pop() || '';

  let key: string;
  if (rpc === 'models') {
    key = 'hf:models:v1';
  } else if (rpc === 'spaces') {
    key = 'hf:spaces:v1';
  } else {
    return new Response(JSON.stringify({ error: 'Unknown RPC', rpc }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const data = await getCachedJson(key, true);
    if (!data) {
      return new Response(JSON.stringify({ models: [], spaces: [], fetchedAt: 0 }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300, stale-while-revalidate=600' },
      });
    }
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300, stale-while-revalidate=600' },
    });
  } catch (err) {
    console.error('[huggingface/v1]', err);
    return new Response(JSON.stringify({ models: [], spaces: [], error: 'upstream error' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
