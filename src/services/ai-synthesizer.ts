/**
 * AI Synthesis Service — calls Claude API to synthesize AI domain intelligence.
 *
 * Provides four synthesis functions:
 *   synthesize24hBreakthroughs()     — top 3 architectural advances from last 24h papers
 *   synthesizeLabActivity()           — 2-sentence per-lab "what they've been up to" summaries
 *   synthesizeFundingThemes()         — emerging investment themes from last 30 days of deals
 *   detectCapabilityDiscontinuity()   — benchmark score jumps >5% week-over-week
 *
 * Results are cached server-side (4 hours) in Redis under `ai-insights:*` keys.
 * On the client, this service calls /api/ai-insights/v1/* — it never calls Anthropic directly.
 */

import { getRpcBaseUrl } from '@/services/rpc-client';
import type { AIResearchPaper, AIFundingRound, AILabProfile, AIBenchmarkScore } from '@/types';

// ─── Response shapes ──────────────────────────────────────────────────────────

export interface BreakthroughSummary {
  rank: 1 | 2 | 3;
  title: string;
  significance: string;   // 1-2 sentence architectural insight
  papers: string[];       // arxivIds
  labs: string[];
  generatedAt: number;
}

export interface LabActivitySummary {
  lab: string;
  labId: string;
  summary: string;        // exactly 2 sentences
  momentum: 'accelerating' | 'steady' | 'slowing';
  generatedAt: number;
}

export interface FundingTheme {
  theme: string;          // e.g. "Physical AI / Robotics"
  totalUSD: number;       // sum of rounds in theme, millions
  dealCount: number;
  representativeCompanies: string[];
  insight: string;        // 1-sentence Claude-generated insight
  generatedAt: number;
}

export interface CapabilityDiscontinuity {
  benchmark: string;
  model: string;
  lab: string;
  previousScore: number;
  currentScore: number;
  jumpPercent: number;
  interpretation: string; // Claude-generated 1-sentence significance
  detectedAt: number;
}

export interface AIInsightsSummary {
  breakthroughs: BreakthroughSummary[];
  labActivity: LabActivitySummary[];
  fundingThemes: FundingTheme[];
  discontinuities: CapabilityDiscontinuity[];
  generatedAt: number;
  /** ISO timestamp when cache expires (4h from generatedAt) */
  cacheExpiresAt: number;
}

// ─── Client helpers ───────────────────────────────────────────────────────────

async function fetchInsights<T>(rpc: string): Promise<T | null> {
  try {
    const base = getRpcBaseUrl();
    const resp = await fetch(`${base}/api/ai-insights/v1/${rpc}`, {
      signal: AbortSignal.timeout(15_000),
    });
    if (!resp.ok) return null;
    return resp.json() as Promise<T>;
  } catch {
    return null;
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Fetch Claude-synthesized top-3 architectural breakthroughs from the last 24h.
 * Results are pre-computed and cached server-side; this is a lightweight fetch.
 */
export async function synthesize24hBreakthroughs(): Promise<BreakthroughSummary[]> {
  const result = await fetchInsights<{ breakthroughs: BreakthroughSummary[] }>('breakthroughs');
  return result?.breakthroughs ?? [];
}

/**
 * Fetch per-lab activity summaries (2 sentences each, Claude-generated).
 */
export async function synthesizeLabActivity(labIds?: string[]): Promise<LabActivitySummary[]> {
  const qs = labIds?.length ? `?labs=${labIds.join(',')}` : '';
  const result = await fetchInsights<{ labActivity: LabActivitySummary[] }>(`lab-activity${qs}`);
  return result?.labActivity ?? [];
}

/**
 * Fetch Claude-identified emerging investment themes from the last 30 days.
 */
export async function synthesizeFundingThemes(): Promise<FundingTheme[]> {
  const result = await fetchInsights<{ fundingThemes: FundingTheme[] }>('funding-themes');
  return result?.fundingThemes ?? [];
}

/**
 * Fetch benchmark scores that jumped >5% week-over-week.
 */
export async function detectCapabilityDiscontinuity(): Promise<CapabilityDiscontinuity[]> {
  const result = await fetchInsights<{ discontinuities: CapabilityDiscontinuity[] }>('discontinuities');
  return result?.discontinuities ?? [];
}

/**
 * Convenience: fetch all four synthesis results in parallel.
 */
export async function fetchAllAIInsights(): Promise<AIInsightsSummary | null> {
  const result = await fetchInsights<AIInsightsSummary>('summary');
  return result;
}

// ─── Server-side synthesis helpers (used by api/ai-insights/v1) ──────────────
// These are imported by the Vercel edge function, not called client-side.

const CACHE_TTL_SECONDS = 4 * 60 * 60; // 4 hours

/** Prompt builder for 24h breakthrough synthesis */
export function buildBreakthroughPrompt(papers: AIResearchPaper[]): string {
  const paperList = papers
    .slice(0, 40)
    .map((p, i) =>
      `${i + 1}. [${p.arxivId}] "${p.title}" — ${p.labs.join(', ')}\n   Abstract: ${p.abstract.slice(0, 300)}…`
    )
    .join('\n\n');

  return `You are an AI research analyst. Below are AI/ML papers published in the last 24 hours.

Identify the 3 most significant architectural or algorithmic advances. For each:
- Give it a descriptive title (not the paper title)
- Write 1-2 sentences explaining the architectural significance for practitioners
- Note which arxiv IDs and labs are involved

Respond as JSON with this exact shape:
{
  "breakthroughs": [
    { "rank": 1, "title": "...", "significance": "...", "papers": ["arxivId"], "labs": ["..."] },
    { "rank": 2, ... },
    { "rank": 3, ... }
  ]
}

Papers:
${paperList}`;
}

/** Prompt builder for lab activity synthesis */
export function buildLabActivityPrompt(lab: AILabProfile, recentHeadlines: string[]): string {
  const headlines = recentHeadlines.slice(0, 20).map((h, i) => `${i + 1}. ${h}`).join('\n');
  return `You are an AI industry analyst. Summarize what ${lab.name} has been doing recently.

Recent headlines about ${lab.name}:
${headlines}

Write exactly 2 sentences summarizing their recent activity and momentum.
Also classify their momentum as one of: "accelerating", "steady", or "slowing".

Respond as JSON:
{ "summary": "...", "momentum": "accelerating|steady|slowing" }`;
}

/** Prompt builder for funding theme synthesis */
export function buildFundingThemesPrompt(rounds: AIFundingRound[]): string {
  const roundList = rounds
    .slice(0, 50)
    .map(r => `- ${r.company} (${r.aiVertical}): $${r.amount}${r.amountUnit} ${r.round} — investors: ${r.investors.slice(0, 3).join(', ')}`)
    .join('\n');

  return `You are a venture capital analyst specializing in AI. Below are AI funding rounds from the last 30 days.

Identify the 3-5 strongest emerging investment themes.
For each theme, provide:
- A descriptive theme name
- Total approximate USD raised in that theme (in millions)
- Number of deals
- Representative company names (up to 3)
- One sentence of insight about why this theme is attracting capital

Respond as JSON:
{
  "fundingThemes": [
    { "theme": "...", "totalUSD": 0, "dealCount": 0, "representativeCompanies": ["..."], "insight": "..." }
  ]
}

Funding rounds:
${roundList}`;
}

/** Detect >5% benchmark score jumps between two snapshots */
export function computeCapabilityDiscontinuities(
  currentScores: AIBenchmarkScore[],
  previousScores: AIBenchmarkScore[],
): Array<Omit<CapabilityDiscontinuity, 'interpretation' | 'detectedAt'>> {
  const prevMap = new Map<string, AIBenchmarkScore>();
  for (const s of previousScores) {
    prevMap.set(`${s.benchmark}:${s.model}`, s);
  }

  const jumps: Array<Omit<CapabilityDiscontinuity, 'interpretation' | 'detectedAt'>> = [];

  for (const current of currentScores) {
    const key = `${current.benchmark}:${current.model}`;
    const prev = prevMap.get(key);
    if (!prev || prev.score === 0) continue;

    const jumpPercent = ((current.score - prev.score) / prev.score) * 100;
    if (jumpPercent >= 5) {
      jumps.push({
        benchmark: current.benchmark,
        model: current.model,
        lab: current.lab,
        previousScore: prev.score,
        currentScore: current.score,
        jumpPercent: Math.round(jumpPercent * 10) / 10,
      });
    }
  }

  return jumps.sort((a, b) => b.jumpPercent - a.jumpPercent);
}

/** Prompt builder to interpret a list of capability jumps */
export function buildDiscontinuityPrompt(
  jumps: Array<Omit<CapabilityDiscontinuity, 'interpretation' | 'detectedAt'>>
): string {
  const jumpList = jumps
    .map(j => `- ${j.model} (${j.lab}) on ${j.benchmark}: ${j.previousScore.toFixed(1)} → ${j.currentScore.toFixed(1)} (+${j.jumpPercent}%)`)
    .join('\n');

  return `You are an AI capabilities analyst. The following models have shown significant benchmark score jumps (>5%) week-over-week.

For each jump, write one sentence interpreting its significance (e.g., does this suggest a genuine capability leap, a better evaluation methodology, or alignment with a new task format?).

Respond as JSON:
{
  "interpretations": [
    { "benchmark": "...", "model": "...", "interpretation": "..." }
  ]
}

Jumps detected:
${jumpList}`;
}

export { CACHE_TTL_SECONDS };
