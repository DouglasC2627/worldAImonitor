export const config = { runtime: 'edge' };

/**
 * AI Insights synthesis API — Claude-powered intelligence for the AI domain.
 * All synthesis is computed server-side and cached in Redis for 4 hours.
 *
 * Routes:
 *   GET /api/ai-insights/v1/breakthroughs   → { breakthroughs: BreakthroughSummary[], generatedAt, cacheExpiresAt }
 *   GET /api/ai-insights/v1/lab-activity    → { labActivity: LabActivitySummary[], generatedAt, cacheExpiresAt }
 *   GET /api/ai-insights/v1/funding-themes  → { fundingThemes: FundingTheme[], generatedAt, cacheExpiresAt }
 *   GET /api/ai-insights/v1/discontinuities → { discontinuities: CapabilityDiscontinuity[], generatedAt, cacheExpiresAt }
 *   GET /api/ai-insights/v1/summary         → all four combined
 */

import Anthropic from '@anthropic-ai/sdk';
import { getCachedJson, setCachedJson } from '../../../server/_shared/redis';
import {
  buildBreakthroughPrompt,
  buildLabActivityPrompt,
  buildFundingThemesPrompt,
  buildDiscontinuityPrompt,
  computeCapabilityDiscontinuities,
  CACHE_TTL_SECONDS,
  type BreakthroughSummary,
  type LabActivitySummary,
  type FundingTheme,
  type CapabilityDiscontinuity,
} from '../../../src/services/ai-synthesizer';
import type { AIResearchPaper, AIFundingRound, AILabProfile, AIBenchmarkScore } from '../../../src/types';

const FOUR_HOURS = CACHE_TTL_SECONDS;
const CACHE_CONTROL = `public, max-age=${FOUR_HOURS}, stale-while-revalidate=3600`;

// ─── Anthropic client ─────────────────────────────────────────────────────────

function getAnthropicClient(): Anthropic | null {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  return new Anthropic({ apiKey: key });
}

async function callClaude(client: Anthropic, prompt: string, maxTokens = 1500): Promise<string | null> {
  try {
    const msg = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    });
    const block = msg.content[0];
    if (block.type !== 'text') return null;
    return block.text;
  } catch (err) {
    console.error('[ai-insights] Claude call failed:', err);
    return null;
  }
}

function safeParseJson<T>(text: string): T | null {
  try {
    // Claude sometimes wraps JSON in ```json ... ``` fences
    const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    return JSON.parse(cleaned) as T;
  } catch {
    return null;
  }
}

// ─── Data fetchers (read from Redis — populated by seed scripts) ──────────────

async function fetchRecentPapers(): Promise<AIResearchPaper[]> {
  const data = await getCachedJson('ai-arxiv:papers:v1', true) as { papers?: AIResearchPaper[] } | null;
  return data?.papers ?? [];
}

async function fetchFundingRounds(): Promise<AIFundingRound[]> {
  const data = await getCachedJson('ai-funding:rounds:v1', true) as { rounds?: AIFundingRound[] } | null;
  return data?.rounds ?? [];
}

async function fetchLabProfiles(): Promise<AILabProfile[]> {
  const data = await getCachedJson('ai-labs:profiles:v1', true) as { profiles?: AILabProfile[] } | null;
  return data?.profiles ?? [];
}

async function fetchBenchmarkScores(weekOffset = 0): Promise<AIBenchmarkScore[]> {
  const key = weekOffset === 0 ? 'ai-benchmarks:leaderboards:v1' : `ai-benchmarks:leaderboards:v1:week-${weekOffset}`;
  const data = await getCachedJson(key, true) as { scores?: AIBenchmarkScore[] } | null;
  return data?.scores ?? [];
}

// ─── Synthesis handlers ───────────────────────────────────────────────────────

async function synthesizeBreakthroughs(client: Anthropic): Promise<BreakthroughSummary[]> {
  const cacheKey = 'ai-insights:breakthroughs:v1';
  const cached = await getCachedJson(cacheKey, true) as { breakthroughs?: BreakthroughSummary[] } | null;
  if (cached?.breakthroughs?.length) return cached.breakthroughs;

  const papers = await fetchRecentPapers();
  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;
  const recent = papers.filter(p => {
    const d = p.submittedDate instanceof Date ? p.submittedDate : new Date(p.submittedDate);
    return d.getTime() > oneDayAgo;
  });

  if (recent.length === 0) return [];

  const prompt = buildBreakthroughPrompt(recent);
  const raw = await callClaude(client, prompt, 2000);
  if (!raw) return [];

  const parsed = safeParseJson<{ breakthroughs: BreakthroughSummary[] }>(raw);
  if (!parsed?.breakthroughs) return [];

  const result = parsed.breakthroughs.map(b => ({ ...b, generatedAt: now }));
  await setCachedJson(cacheKey, { breakthroughs: result, fetchedAt: now }, FOUR_HOURS);
  return result;
}

async function synthesizeLabActivity(client: Anthropic, labIds?: string[]): Promise<LabActivitySummary[]> {
  const cacheKey = 'ai-insights:lab-activity:v1';
  const cached = await getCachedJson(cacheKey, true) as { labActivity?: LabActivitySummary[] } | null;
  if (cached?.labActivity?.length) {
    if (!labIds?.length) return cached.labActivity;
    return cached.labActivity.filter(l => labIds.includes(l.labId));
  }

  const labs = await fetchLabProfiles();
  const targetLabs = labIds?.length ? labs.filter(l => labIds.includes(l.id)) : labs.slice(0, 10);

  if (targetLabs.length === 0) return [];

  const now = Date.now();
  const results: LabActivitySummary[] = [];

  // Synthesize labs concurrently in small batches to stay within rate limits
  const BATCH = 4;
  for (let i = 0; i < targetLabs.length; i += BATCH) {
    const batch = targetLabs.slice(i, i + BATCH);
    const batchResults = await Promise.all(batch.map(async (lab) => {
      // Pull recent headlines for this lab from news cache
      const headlines: string[] = [];
      const prompt = buildLabActivityPrompt(lab, headlines);
      const raw = await callClaude(client, prompt, 300);
      if (!raw) return null;

      const parsed = safeParseJson<{ summary: string; momentum: LabActivitySummary['momentum'] }>(raw);
      if (!parsed) return null;

      return {
        lab: lab.name,
        labId: lab.id,
        summary: parsed.summary,
        momentum: parsed.momentum ?? 'steady',
        generatedAt: now,
      } satisfies LabActivitySummary;
    }));
    results.push(...batchResults.filter((r): r is LabActivitySummary => r !== null));
  }

  await setCachedJson(cacheKey, { labActivity: results, fetchedAt: now }, FOUR_HOURS);
  return results;
}

async function synthesizeFundingThemes(client: Anthropic): Promise<FundingTheme[]> {
  const cacheKey = 'ai-insights:funding-themes:v1';
  const cached = await getCachedJson(cacheKey, true) as { fundingThemes?: FundingTheme[] } | null;
  if (cached?.fundingThemes?.length) return cached.fundingThemes;

  const rounds = await fetchFundingRounds();
  const now = Date.now();
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
  const recent = rounds.filter(r => {
    const d = r.date instanceof Date ? r.date : new Date(r.date);
    return d.getTime() > thirtyDaysAgo;
  });

  if (recent.length === 0) return [];

  const prompt = buildFundingThemesPrompt(recent);
  const raw = await callClaude(client, prompt, 1500);
  if (!raw) return [];

  const parsed = safeParseJson<{ fundingThemes: FundingTheme[] }>(raw);
  if (!parsed?.fundingThemes) return [];

  const result = parsed.fundingThemes.map(t => ({ ...t, generatedAt: now }));
  await setCachedJson(cacheKey, { fundingThemes: result, fetchedAt: now }, FOUR_HOURS);
  return result;
}

async function synthesizeDiscontinuities(client: Anthropic): Promise<CapabilityDiscontinuity[]> {
  const cacheKey = 'ai-insights:discontinuities:v1';
  const cached = await getCachedJson(cacheKey, true) as { discontinuities?: CapabilityDiscontinuity[] } | null;
  if (cached?.discontinuities?.length) return cached.discontinuities;

  const [current, previous] = await Promise.all([
    fetchBenchmarkScores(0),
    fetchBenchmarkScores(1),
  ]);

  if (current.length === 0 || previous.length === 0) return [];

  const jumps = computeCapabilityDiscontinuities(current, previous);
  if (jumps.length === 0) return [];

  const now = Date.now();
  const prompt = buildDiscontinuityPrompt(jumps);
  const raw = await callClaude(client, prompt, 1200);

  let interpretations: Array<{ benchmark: string; model: string; interpretation: string }> = [];
  if (raw) {
    const parsed = safeParseJson<{ interpretations: typeof interpretations }>(raw);
    interpretations = parsed?.interpretations ?? [];
  }

  const interMap = new Map(interpretations.map(i => [`${i.benchmark}:${i.model}`, i.interpretation]));
  const result: CapabilityDiscontinuity[] = jumps.map(j => ({
    ...j,
    interpretation: interMap.get(`${j.benchmark}:${j.model}`) ?? `${j.model} improved by ${j.jumpPercent}% on ${j.benchmark}.`,
    detectedAt: now,
  }));

  await setCachedJson(cacheKey, { discontinuities: result, fetchedAt: now }, FOUR_HOURS);
  return result;
}

// ─── Edge handler ─────────────────────────────────────────────────────────────

function jsonResp(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': CACHE_CONTROL,
    },
  });
}

function errResp(rpc: string): Response {
  return new Response(JSON.stringify({ error: 'Unknown RPC', rpc }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
  });
}

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const rpc = url.pathname.split('/').pop() || '';

  const client = getAnthropicClient();

  // If no API key, return empty stubs so the UI degrades gracefully
  if (!client) {
    const empty = { breakthroughs: [], labActivity: [], fundingThemes: [], discontinuities: [], generatedAt: 0, cacheExpiresAt: 0 };
    if (rpc === 'summary') return jsonResp(empty);
    if (rpc === 'breakthroughs') return jsonResp({ breakthroughs: [], generatedAt: 0, cacheExpiresAt: 0 });
    if (rpc === 'lab-activity') return jsonResp({ labActivity: [], generatedAt: 0, cacheExpiresAt: 0 });
    if (rpc === 'funding-themes') return jsonResp({ fundingThemes: [], generatedAt: 0, cacheExpiresAt: 0 });
    if (rpc === 'discontinuities') return jsonResp({ discontinuities: [], generatedAt: 0, cacheExpiresAt: 0 });
    return errResp(rpc);
  }

  const now = Date.now();
  const cacheExpiresAt = now + FOUR_HOURS * 1000;

  try {
    // Parse optional ?labs= query param for lab-activity
    const labIds = url.searchParams.get('labs')?.split(',').filter(Boolean);

    if (rpc === 'breakthroughs') {
      const breakthroughs = await synthesizeBreakthroughs(client);
      return jsonResp({ breakthroughs, generatedAt: now, cacheExpiresAt });
    }

    if (rpc === 'lab-activity') {
      const labActivity = await synthesizeLabActivity(client, labIds);
      return jsonResp({ labActivity, generatedAt: now, cacheExpiresAt });
    }

    if (rpc === 'funding-themes') {
      const fundingThemes = await synthesizeFundingThemes(client);
      return jsonResp({ fundingThemes, generatedAt: now, cacheExpiresAt });
    }

    if (rpc === 'discontinuities') {
      const discontinuities = await synthesizeDiscontinuities(client);
      return jsonResp({ discontinuities, generatedAt: now, cacheExpiresAt });
    }

    if (rpc === 'summary') {
      // Run all four in parallel — each has its own Redis cache so concurrent calls are safe
      const [breakthroughs, labActivity, fundingThemes, discontinuities] = await Promise.all([
        synthesizeBreakthroughs(client),
        synthesizeLabActivity(client),
        synthesizeFundingThemes(client),
        synthesizeDiscontinuities(client),
      ]);
      return jsonResp({ breakthroughs, labActivity, fundingThemes, discontinuities, generatedAt: now, cacheExpiresAt });
    }

    return errResp(rpc);
  } catch (err) {
    console.error('[ai-insights/v1]', err);
    return new Response(JSON.stringify({ error: 'synthesis error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
