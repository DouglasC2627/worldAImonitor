export const config = { runtime: 'edge' };

/**
 * AI Safety & Incidents API — serves data seeded by seed-ai-incidents.mjs.
 *
 * GET /api/ai-safety/v1/incidents        → { incidents: AIIncident[], fetchedAt: number }
 * GET /api/ai-safety/v1/vulnerabilities  → { vulnerabilities: AIVuln[], forumPosts: Post[], fetchedAt: number }
 */

import { getCachedJson } from '../../../server/_shared/redis';

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const rpc = url.pathname.split('/').pop() || '';

  let key: string;
  if (rpc === 'incidents') {
    key = 'ai-safety:incidents:v1';
  } else if (rpc === 'vulnerabilities') {
    key = 'ai-safety:vulnerabilities:v1';
  } else {
    return new Response(JSON.stringify({ error: 'Unknown RPC', rpc }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const data = await getCachedJson(key, true);
    if (!data) {
      return new Response(JSON.stringify({ incidents: [], vulnerabilities: [], fetchedAt: 0 }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=600, stale-while-revalidate=3600' },
      });
    }
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=600, stale-while-revalidate=3600' },
    });
  } catch (err) {
    console.error('[ai-safety/v1]', err);
    return new Response(JSON.stringify({ incidents: [], error: 'upstream error' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
