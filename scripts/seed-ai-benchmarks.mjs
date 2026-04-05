#!/usr/bin/env node

/**
 * Seed AI benchmark leaderboard snapshots for the AI variant.
 *
 * Pulls SOTA scores from Papers With Code leaderboard API for:
 *   MMLU, HumanEval, MBPP, SWE-bench Verified, GPQA, MATH, AIME 2024,
 *   BIG-Bench Hard, MMMU, HellaSwag, DROP, ARC Challenge
 *
 * Detects new SOTA scores (score > previous leader).
 *
 * Redis keys written:
 *   ai-benchmarks:leaderboards:v1    — all benchmark scores (TTL 12h)
 *   ai-benchmarks:sota-alerts:v1     — new SOTA events detected (TTL 24h)
 */

import { loadEnvFile, CHROME_UA, runSeed, writeExtraKeyWithMeta, sleep } from './_seed-utils.mjs';

loadEnvFile(import.meta.url);

const BENCHMARKS_TTL = 43200; // 12h
const PWC_API = 'https://paperswithcode.com/api/v1';

// Benchmark slug → display name mapping
const BENCHMARKS = [
  { slug: 'mmlu', name: 'MMLU', higherIsBetter: true },
  { slug: 'humaneval', name: 'HumanEval', higherIsBetter: true },
  { slug: 'mbpp', name: 'MBPP', higherIsBetter: true },
  { slug: 'swe-bench-verified', name: 'SWE-bench Verified', higherIsBetter: true },
  { slug: 'gpqa', name: 'GPQA', higherIsBetter: true },
  { slug: 'math', name: 'MATH', higherIsBetter: true },
  { slug: 'hellaswag', name: 'HellaSwag', higherIsBetter: true },
  { slug: 'arc-challenge', name: 'ARC Challenge', higherIsBetter: true },
  { slug: 'drop', name: 'DROP', higherIsBetter: true },
  { slug: 'big-bench-hard', name: 'BIG-Bench Hard', higherIsBetter: true },
  { slug: 'mmmu', name: 'MMMU', higherIsBetter: true },
];

// ─── Papers With Code leaderboard fetch ───

async function fetchBenchmarkResults(benchmark) {
  try {
    // Get the task/dataset for this benchmark
    const searchResp = await fetch(
      `${PWC_API}/datasets/?q=${encodeURIComponent(benchmark.name)}&limit=1`,
      {
        headers: { Accept: 'application/json', 'User-Agent': CHROME_UA },
        signal: AbortSignal.timeout(10_000),
      },
    );
    if (!searchResp.ok) { console.warn(`  PWC ${benchmark.name}: HTTP ${searchResp.status}`); return null; }
    const searchData = await searchResp.json();
    const datasetId = searchData?.results?.[0]?.id;
    if (!datasetId) { console.warn(`  PWC ${benchmark.name}: dataset not found`); return null; }

    // Get SOTA results for this dataset
    const resultsResp = await fetch(
      `${PWC_API}/datasets/${datasetId}/results/?limit=20`,
      {
        headers: { Accept: 'application/json', 'User-Agent': CHROME_UA },
        signal: AbortSignal.timeout(10_000),
      },
    );
    if (!resultsResp.ok) { console.warn(`  PWC ${benchmark.name}: results HTTP ${resultsResp.status}`); return null; }
    const resultsData = await resultsResp.json();
    const results = resultsData?.results ?? [];

    if (results.length === 0) { console.warn(`  PWC ${benchmark.name}: no results`); return null; }

    const scores = results.map(r => ({
      model: r.model_name || r.paper?.title || '',
      score: r.best_metric?.value ?? r.metrics?.[0]?.value ?? 0,
      date: r.paper?.published ?? r.evaluated_at ?? '',
      paperLink: r.paper?.url_abs || r.paper?.url_pdf || '',
      lab: r.paper?.authors?.[0] || '',
      isSOTA: false,
    })).filter(s => s.model && s.score > 0);

    // Mark the top score as SOTA
    scores.sort((a, b) => benchmark.higherIsBetter ? b.score - a.score : a.score - b.score);
    if (scores[0]) scores[0].isSOTA = true;

    console.log(`  PWC ${benchmark.name}: ${scores.length} results, SOTA=${scores[0]?.score ?? 'n/a'}`);
    return { benchmark: benchmark.name, slug: benchmark.slug, scores, fetchedAt: Date.now() };
  } catch (e) {
    console.warn(`  PWC ${benchmark.name}: ${e.message}`);
    return null;
  }
}

// ─── SOTA change detection ───

function detectSotaChanges(leaderboards) {
  const alerts = [];
  for (const board of leaderboards) {
    const sota = board.scores.find(s => s.isSOTA);
    if (!sota) continue;
    // Flag as "new SOTA alert" if the record date is within last 7 days
    const cutoff = Date.now() - 7 * 86400_000;
    const recordDate = sota.date ? new Date(sota.date).getTime() : 0;
    if (recordDate > cutoff) {
      alerts.push({
        benchmark: board.benchmark,
        model: sota.model,
        score: sota.score,
        lab: sota.lab,
        date: sota.date,
        paperLink: sota.paperLink,
      });
    }
  }
  return alerts;
}

// ─── Main ───

async function fetchAll() {
  const leaderboards = [];

  for (const benchmark of BENCHMARKS) {
    const result = await fetchBenchmarkResults(benchmark);
    if (result) leaderboards.push(result);
    await sleep(500); // rate limit
  }

  if (leaderboards.length === 0) throw new Error('No benchmark data fetched');

  const sotaAlerts = detectSotaChanges(leaderboards);
  console.log(`  SOTA alerts (last 7d): ${sotaAlerts.length}`);

  if (sotaAlerts.length > 0) {
    await writeExtraKeyWithMeta(
      'ai-benchmarks:sota-alerts:v1',
      { alerts: sotaAlerts, fetchedAt: Date.now() },
      86400,
      sotaAlerts.length,
    );
  }

  return { leaderboards, fetchedAt: Date.now() };
}

function validate(data) {
  return Array.isArray(data?.leaderboards) && data.leaderboards.length > 0;
}

runSeed('ai-benchmarks', 'leaderboards', 'ai-benchmarks:leaderboards:v1', fetchAll, {
  validateFn: validate,
  ttlSeconds: BENCHMARKS_TTL,
  sourceVersion: 'ai-benchmarks-v1',
}).catch((err) => {
  const cause = err.cause ? ` (cause: ${err.cause.message || err.cause.code || err.cause})` : '';
  console.error('FATAL:', (err.message || err) + cause);
  process.exit(1);
});
