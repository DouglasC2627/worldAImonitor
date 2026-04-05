#!/usr/bin/env node

/**
 * Seed AI lab activity composite scores for the AI variant.
 *
 * For each of 20 tracked AI labs, aggregates:
 *  - Recent paper count (last 30 days) from Semantic Scholar
 *  - GitHub repository activity (stars, recent commits)
 *  - Model releases (detected via HuggingFace author lookup)
 *
 * Computes a "Lab Activity Score" (0–100) composite metric.
 *
 * Redis keys written:
 *   ai-labs:profiles:v1    — lab profiles with activity scores (TTL 12h)
 */

import { loadEnvFile, CHROME_UA, runSeed, sleep } from './_seed-utils.mjs';

loadEnvFile(import.meta.url);

const LABS_TTL = 43200; // 12h

// ─── Lab definitions ───

const AI_LABS = [
  { id: 'openai', name: 'OpenAI', shortName: 'OpenAI', tier: 1, hqCity: 'San Francisco', hqCountry: 'USA', lat: 37.7749, lon: -122.4194, githubOrg: 'openai', hfAuthor: 'openai', semanticScholarId: null, website: 'https://openai.com' },
  { id: 'google-deepmind', name: 'Google DeepMind', shortName: 'DeepMind', tier: 1, hqCity: 'London', hqCountry: 'UK', lat: 51.5074, lon: -0.1278, githubOrg: 'google-deepmind', hfAuthor: 'google', semanticScholarId: null, website: 'https://deepmind.google' },
  { id: 'anthropic', name: 'Anthropic', shortName: 'Anthropic', tier: 1, hqCity: 'San Francisco', hqCountry: 'USA', lat: 37.7749, lon: -122.4194, githubOrg: 'anthropics', hfAuthor: 'anthropic', semanticScholarId: null, website: 'https://anthropic.com' },
  { id: 'meta-ai', name: 'Meta AI', shortName: 'Meta AI', tier: 1, hqCity: 'Menlo Park', hqCountry: 'USA', lat: 37.4530, lon: -122.1817, githubOrg: 'facebookresearch', hfAuthor: 'meta-llama', semanticScholarId: null, website: 'https://ai.meta.com' },
  { id: 'xai', name: 'xAI', shortName: 'xAI', tier: 1, hqCity: 'San Francisco', hqCountry: 'USA', lat: 37.7749, lon: -122.4194, githubOrg: 'xai-org', hfAuthor: 'xai-org', semanticScholarId: null, website: 'https://x.ai' },
  { id: 'mistral', name: 'Mistral AI', shortName: 'Mistral', tier: 2, hqCity: 'Paris', hqCountry: 'France', lat: 48.8566, lon: 2.3522, githubOrg: 'mistralai', hfAuthor: 'mistralai', semanticScholarId: null, website: 'https://mistral.ai' },
  { id: 'cohere', name: 'Cohere', shortName: 'Cohere', tier: 2, hqCity: 'Toronto', hqCountry: 'Canada', lat: 43.6532, lon: -79.3832, githubOrg: 'cohere-ai', hfAuthor: 'CohereForAI', semanticScholarId: null, website: 'https://cohere.com' },
  { id: 'huggingface', name: 'HuggingFace', shortName: 'HuggingFace', tier: 2, hqCity: 'New York', hqCountry: 'USA', lat: 40.7128, lon: -74.0060, githubOrg: 'huggingface', hfAuthor: 'HuggingFaceH4', semanticScholarId: null, website: 'https://huggingface.co' },
  { id: 'eleutherai', name: 'EleutherAI', shortName: 'EleutherAI', tier: 2, hqCity: 'Remote', hqCountry: 'USA', lat: 37.7749, lon: -122.4194, githubOrg: 'EleutherAI', hfAuthor: 'EleutherAI', semanticScholarId: null, website: 'https://eleuther.ai' },
  { id: 'allen-ai', name: 'Allen Institute for AI', shortName: 'Ai2', tier: 2, hqCity: 'Seattle', hqCountry: 'USA', lat: 47.6062, lon: -122.3321, githubOrg: 'allenai', hfAuthor: 'allenai', semanticScholarId: null, website: 'https://allenai.org' },
  { id: 'stability-ai', name: 'Stability AI', shortName: 'Stability', tier: 2, hqCity: 'London', hqCountry: 'UK', lat: 51.5074, lon: -0.1278, githubOrg: 'Stability-AI', hfAuthor: 'stabilityai', semanticScholarId: null, website: 'https://stability.ai' },
  { id: 'inflection', name: 'Inflection AI', shortName: 'Inflection', tier: 2, hqCity: 'Palo Alto', hqCountry: 'USA', lat: 37.4419, lon: -122.1430, githubOrg: 'inflection-ai', hfAuthor: 'inflection-ai', semanticScholarId: null, website: 'https://inflection.ai' },
  { id: 'mit-csail', name: 'MIT CSAIL', shortName: 'MIT CSAIL', tier: 2, hqCity: 'Cambridge', hqCountry: 'USA', lat: 42.3601, lon: -71.0942, githubOrg: 'CSAIL-MIT', hfAuthor: 'mit-han-lab', semanticScholarId: null, website: 'https://csail.mit.edu' },
  { id: 'stanford-hai', name: 'Stanford HAI', shortName: 'Stanford HAI', tier: 2, hqCity: 'Stanford', hqCountry: 'USA', lat: 37.4275, lon: -122.1697, githubOrg: 'stanford-crfm', hfAuthor: 'stanford-crfm', semanticScholarId: null, website: 'https://hai.stanford.edu' },
  { id: 'berkeley-bair', name: 'Berkeley BAIR', shortName: 'BAIR', tier: 2, hqCity: 'Berkeley', hqCountry: 'USA', lat: 37.8716, lon: -122.2727, githubOrg: 'rail-berkeley', hfAuthor: 'berkeley-nest', semanticScholarId: null, website: 'https://bair.berkeley.edu' },
  { id: 'cmu-lti', name: 'CMU LTI', shortName: 'CMU', tier: 2, hqCity: 'Pittsburgh', hqCountry: 'USA', lat: 40.4433, lon: -79.9436, githubOrg: 'cmu-lti', hfAuthor: 'cmu-lti', semanticScholarId: null, website: 'https://www.lti.cs.cmu.edu' },
  { id: 'miri', name: 'Machine Intelligence Research Institute', shortName: 'MIRI', tier: 3, hqCity: 'Berkeley', hqCountry: 'USA', lat: 37.8716, lon: -122.2727, githubOrg: 'machine-intelligence-research-institute', hfAuthor: null, semanticScholarId: null, website: 'https://intelligence.org' },
  { id: 'redwood-research', name: 'Redwood Research', shortName: 'Redwood', tier: 3, hqCity: 'Berkeley', hqCountry: 'USA', lat: 37.8716, lon: -122.2727, githubOrg: 'redwoodresearch', hfAuthor: 'Redwood Research', semanticScholarId: null, website: 'https://redwoodresearch.org' },
  { id: 'arc', name: 'Alignment Research Center', shortName: 'ARC', tier: 3, hqCity: 'San Francisco', hqCountry: 'USA', lat: 37.7749, lon: -122.4194, githubOrg: 'ARC-Evals', hfAuthor: null, semanticScholarId: null, website: 'https://alignment.org' },
  { id: 'eth-zurich', name: 'ETH Zurich AI Center', shortName: 'ETH Zurich', tier: 2, hqCity: 'Zurich', hqCountry: 'Switzerland', lat: 47.3769, lon: 8.5417, githubOrg: 'eth-ds-lab', hfAuthor: 'eth-ds-lab', semanticScholarId: null, website: 'https://ai.ethz.ch' },
];

// ─── Semantic Scholar paper count ───

async function fetchPaperCount(labName) {
  const cutoff = new Date(Date.now() - 30 * 86400_000).toISOString().split('T')[0];
  try {
    const resp = await fetch(
      `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(labName)}&fields=year,publicationDate&limit=50`,
      {
        headers: { Accept: 'application/json', 'User-Agent': CHROME_UA },
        signal: AbortSignal.timeout(10_000),
      },
    );
    if (!resp.ok) return 0;
    const data = await resp.json();
    const recent = (data?.data ?? []).filter(p => {
      const d = p.publicationDate || '';
      return d >= cutoff;
    });
    return recent.length;
  } catch {
    return 0;
  }
}

// ─── GitHub repo stars ───

async function fetchGitHubStars(org) {
  if (!org) return 0;
  try {
    const resp = await fetch(`https://api.github.com/orgs/${org}/repos?sort=stars&per_page=5`, {
      headers: { Accept: 'application/vnd.github+json', 'User-Agent': CHROME_UA },
      signal: AbortSignal.timeout(8_000),
    });
    if (!resp.ok) return 0;
    const repos = await resp.json();
    if (!Array.isArray(repos)) return 0;
    return repos.reduce((sum, r) => sum + (r.stargazers_count ?? 0), 0);
  } catch {
    return 0;
  }
}

// ─── HuggingFace model count ───

async function fetchHFModelCount(author) {
  if (!author) return 0;
  try {
    const resp = await fetch(`https://huggingface.co/api/models?author=${encodeURIComponent(author)}&limit=1&full=false`, {
      headers: { Accept: 'application/json', 'User-Agent': CHROME_UA },
      signal: AbortSignal.timeout(8_000),
    });
    if (!resp.ok) return 0;
    // The count is in the X-Total-Count header or from the Link header
    const total = resp.headers.get('X-Total-Count');
    if (total) return parseInt(total, 10) || 0;
    const data = await resp.json();
    return Array.isArray(data) ? data.length : 0;
  } catch {
    return 0;
  }
}

// ─── Composite score ───

function computeActivityScore({ paperCount30d, githubStars, hfModelCount }) {
  // Normalize each signal to 0–100 range with soft caps
  const paperScore = Math.min(100, (paperCount30d / 20) * 100); // 20 papers = 100
  const starScore = Math.min(100, (Math.log10(githubStars + 1) / 5) * 100); // log scale, 100k stars ≈ 100
  const hfScore = Math.min(100, (hfModelCount / 50) * 100); // 50 models = 100

  // Weighted average: papers 50%, stars 30%, HF models 20%
  return Math.round(paperScore * 0.5 + starScore * 0.3 + hfScore * 0.2);
}

// ─── Main ───

async function fetchAll() {
  const profiles = [];

  for (const lab of AI_LABS) {
    const [paperCount, githubStars, hfModelCount] = await Promise.allSettled([
      fetchPaperCount(lab.name),
      fetchGitHubStars(lab.githubOrg),
      fetchHFModelCount(lab.hfAuthor),
    ]);

    const metrics = {
      paperCount30d: paperCount.status === 'fulfilled' ? paperCount.value : 0,
      githubStars: githubStars.status === 'fulfilled' ? githubStars.value : 0,
      hfModelCount: hfModelCount.status === 'fulfilled' ? hfModelCount.value : 0,
    };

    const activityScore = computeActivityScore(metrics);

    profiles.push({
      ...lab,
      ...metrics,
      activityScore,
      fetchedAt: Date.now(),
    });

    console.log(`  ${lab.shortName}: papers=${metrics.paperCount30d}, stars=${metrics.githubStars}, hfModels=${metrics.hfModelCount}, score=${activityScore}`);
    await sleep(300); // gentle rate limiting
  }

  // Sort by activity score descending
  profiles.sort((a, b) => b.activityScore - a.activityScore);

  return { profiles, fetchedAt: Date.now() };
}

function validate(data) {
  return Array.isArray(data?.profiles) && data.profiles.length > 0;
}

runSeed('ai-labs', 'profiles', 'ai-labs:profiles:v1', fetchAll, {
  validateFn: validate,
  ttlSeconds: LABS_TTL,
  sourceVersion: 'ai-labs-v1',
}).catch((err) => {
  const cause = err.cause ? ` (cause: ${err.cause.message || err.cause.code || err.cause})` : '';
  console.error('FATAL:', (err.message || err) + cause);
  process.exit(1);
});
