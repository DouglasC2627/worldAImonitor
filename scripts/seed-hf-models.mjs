#!/usr/bin/env node

/**
 * Seed HuggingFace model and Space activity for the AI variant.
 *
 * Polls:
 *  - HuggingFace models API: new model releases (last 24h, sorted by downloads)
 *  - HuggingFace Spaces API: trending new spaces
 *
 * Redis keys written:
 *   hf:models:v1       — recent/trending models (TTL 6h)
 *   hf:spaces:v1       — trending spaces (TTL 6h)
 */

import { loadEnvFile, CHROME_UA, runSeed, writeExtraKeyWithMeta, sleep } from './_seed-utils.mjs';

loadEnvFile(import.meta.url);

const HF_TTL = 21600; // 6h
const HF_API = 'https://huggingface.co/api';

// ─── Models ───

async function fetchNewModels() {
  const since = new Date(Date.now() - 48 * 3600_000).toISOString();
  const params = new URLSearchParams({
    sort: 'downloads',
    direction: '-1',
    limit: '100',
    filter: 'text-generation',
    full: 'false',
  });

  const resp = await fetch(`${HF_API}/models?${params}`, {
    headers: { Accept: 'application/json', 'User-Agent': CHROME_UA },
    signal: AbortSignal.timeout(15_000),
  });
  if (!resp.ok) throw new Error(`HF models API: HTTP ${resp.status}`);
  const data = await resp.json();
  if (!Array.isArray(data)) return [];

  return data.map(m => ({
    id: m.id || '',
    modelName: (m.id || '').split('/').pop() || '',
    author: (m.id || '').split('/')[0] || '',
    downloads: m.downloads ?? 0,
    likes: m.likes ?? 0,
    tags: Array.isArray(m.tags) ? m.tags.slice(0, 10) : [],
    pipeline: m.pipeline_tag || '',
    license: m.cardData?.license || '',
    createdAt: m.createdAt ? new Date(m.createdAt).getTime() : 0,
    url: `https://huggingface.co/${m.id || ''}`,
  }))
    .filter(m => m.id)
    .sort((a, b) => b.downloads - a.downloads);
}

async function fetchAllModelsVariants() {
  const pipelines = ['text-generation', 'text-to-image', 'text-to-video', 'image-to-text'];
  const results = [];
  const seen = new Set();

  for (const pipeline of pipelines) {
    const params = new URLSearchParams({
      sort: 'downloads',
      direction: '-1',
      limit: '50',
      filter: pipeline,
      full: 'false',
    });

    try {
      const resp = await fetch(`${HF_API}/models?${params}`, {
        headers: { Accept: 'application/json', 'User-Agent': CHROME_UA },
        signal: AbortSignal.timeout(12_000),
      });
      if (!resp.ok) { console.warn(`  HF models (${pipeline}): HTTP ${resp.status}`); continue; }
      const data = await resp.json();
      if (!Array.isArray(data)) continue;

      for (const m of data) {
        if (!m.id || seen.has(m.id)) continue;
        seen.add(m.id);
        results.push({
          id: m.id,
          modelName: m.id.split('/').pop() || '',
          author: m.id.split('/')[0] || '',
          downloads: m.downloads ?? 0,
          likes: m.likes ?? 0,
          tags: Array.isArray(m.tags) ? m.tags.slice(0, 10) : [],
          pipeline: m.pipeline_tag || pipeline,
          license: m.cardData?.license || '',
          createdAt: m.createdAt ? new Date(m.createdAt).getTime() : 0,
          url: `https://huggingface.co/${m.id}`,
        });
      }
      console.log(`  HF models (${pipeline}): ${data.length} models`);
    } catch (e) {
      console.warn(`  HF models (${pipeline}): ${e.message}`);
    }
    await sleep(500);
  }

  return results.sort((a, b) => b.downloads - a.downloads);
}

// ─── Spaces ───

async function fetchTrendingSpaces() {
  const params = new URLSearchParams({
    sort: 'likes',
    direction: '-1',
    limit: '50',
    full: 'false',
  });

  const resp = await fetch(`${HF_API}/spaces?${params}`, {
    headers: { Accept: 'application/json', 'User-Agent': CHROME_UA },
    signal: AbortSignal.timeout(12_000),
  });
  if (!resp.ok) throw new Error(`HF spaces API: HTTP ${resp.status}`);
  const data = await resp.json();
  if (!Array.isArray(data)) return [];

  return data.map(s => ({
    id: s.id || '',
    spaceName: (s.id || '').split('/').pop() || '',
    author: (s.id || '').split('/')[0] || '',
    likes: s.likes ?? 0,
    tags: Array.isArray(s.tags) ? s.tags.slice(0, 8) : [],
    runtime: s.runtime?.stage || '',
    sdk: s.cardData?.sdk || '',
    createdAt: s.createdAt ? new Date(s.createdAt).getTime() : 0,
    url: `https://huggingface.co/spaces/${s.id || ''}`,
  })).filter(s => s.id);
}

// ─── Main ───

let allData = null;

async function fetchAll() {
  const [models, spaces] = await Promise.allSettled([
    fetchAllModelsVariants(),
    fetchTrendingSpaces(),
  ]);

  const modelsData = models.status === 'fulfilled' ? models.value : [];
  const spacesData = spaces.status === 'fulfilled' ? spaces.value : [];

  if (models.status === 'rejected') console.warn(`  HF models failed: ${models.reason?.message}`);
  if (spaces.status === 'rejected') console.warn(`  HF spaces failed: ${spaces.reason?.message}`);

  console.log(`  HF models total: ${modelsData.length}, spaces: ${spacesData.length}`);

  allData = { models: modelsData, spaces: spacesData };

  if (spacesData.length > 0) {
    await writeExtraKeyWithMeta('hf:spaces:v1', { spaces: spacesData, fetchedAt: Date.now() }, HF_TTL, spacesData.length);
  }

  if (modelsData.length === 0) throw new Error('No HuggingFace models fetched');
  return { models: modelsData, fetchedAt: Date.now() };
}

function validate(data) {
  return data?.models?.length > 0;
}

runSeed('hf', 'models-spaces', 'hf:models:v1', fetchAll, {
  validateFn: validate,
  ttlSeconds: HF_TTL,
  sourceVersion: 'hf-v1',
}).catch((err) => {
  const cause = err.cause ? ` (cause: ${err.cause.message || err.cause.code || err.cause})` : '';
  console.error('FATAL:', (err.message || err) + cause);
  process.exit(1);
});
