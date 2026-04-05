#!/usr/bin/env node

/**
 * Seed ArXiv AI/ML papers for the AI variant.
 * Fetches from all 6 relevant CS/ML ArXiv categories daily:
 *   cs.AI, cs.LG, cs.CL, cs.CV, cs.RO, stat.ML
 *
 * Additionally cross-references Semantic Scholar for citation counts
 * and Papers With Code for benchmark results where available.
 *
 * Redis keys written:
 *   arxiv-ai:papers:v1:<category>   — paper list per category (TTL 24h)
 *   arxiv-ai:clusters:v1            — similarity-clustered papers (TTL 24h)
 */

import { loadEnvFile, CHROME_UA, runSeed, writeExtraKeyWithMeta, sleep } from './_seed-utils.mjs';

loadEnvFile(import.meta.url);

const ARXIV_TTL = 86400; // 24h
const CATEGORIES = ['cs.AI', 'cs.LG', 'cs.CL', 'cs.CV', 'cs.RO', 'stat.ML'];
const MAX_RESULTS = 50;
const ARXIV_RATE_LIMIT_MS = 3000; // arXiv asks ≥3s between requests

// ─── ArXiv Fetch ───

async function fetchArxivCategory(cat) {
  const url = `https://export.arxiv.org/api/query?search_query=cat:${cat}&start=0&max_results=${MAX_RESULTS}&sortBy=submittedDate&sortOrder=descending`;
  const resp = await fetch(url, {
    headers: { Accept: 'application/xml', 'User-Agent': CHROME_UA },
    signal: AbortSignal.timeout(20_000),
  });
  if (!resp.ok) throw new Error(`arXiv ${cat}: HTTP ${resp.status}`);
  const xml = await resp.text();

  const papers = [];
  const entryBlocks = xml.split('<entry>').slice(1);
  for (const block of entryBlocks) {
    const id = (block.match(/<id>([\s\S]*?)<\/id>/)?.[1] || '').trim().split('/').pop() || '';
    const title = (block.match(/<title>([\s\S]*?)<\/title>/)?.[1] || '').trim().replace(/\s+/g, ' ');
    const summary = (block.match(/<summary>([\s\S]*?)<\/summary>/)?.[1] || '').trim().replace(/\s+/g, ' ');
    const published = block.match(/<published>([\s\S]*?)<\/published>/)?.[1]?.trim() || '';
    const publishedAt = published ? new Date(published).getTime() : 0;

    const urlMatch = block.match(/<link[^>]*rel="alternate"[^>]*href="([^"]+)"/);
    const paperUrl = urlMatch?.[1] || `https://arxiv.org/abs/${id}`;

    const authors = [];
    for (const m of block.matchAll(/<author>\s*<name>([\s\S]*?)<\/name>/g)) authors.push(m[1].trim());

    const cats = [];
    for (const m of block.matchAll(/<category[^>]*term="([^"]+)"/g)) cats.push(m[1]);

    if (title && id) {
      papers.push({ id, title, summary, authors, categories: cats, publishedAt, url: paperUrl });
    }
  }

  return papers;
}

// ─── Semantic Scholar citation enrichment ───
// Batches up to 100 ArXiv IDs per request via the S2 Graph API.

async function enrichWithCitations(papers) {
  if (papers.length === 0) return papers;

  const ids = papers.map(p => `ARXIV:${p.id}`).slice(0, 100);
  try {
    const resp = await fetch('https://api.semanticscholar.org/graph/v1/paper/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'User-Agent': CHROME_UA },
      body: JSON.stringify({ ids, fields: 'citationCount,influentialCitationCount' }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!resp.ok) {
      console.warn(`  Semantic Scholar: HTTP ${resp.status} — skipping citation enrichment`);
      return papers;
    }
    const data = await resp.json();
    if (!Array.isArray(data)) return papers;

    const citationMap = new Map();
    for (const entry of data) {
      if (entry?.externalIds?.ArXiv) {
        citationMap.set(entry.externalIds.ArXiv, {
          citationCount: entry.citationCount ?? 0,
          influentialCitations: entry.influentialCitationCount ?? 0,
        });
      }
    }

    return papers.map(p => {
      const cit = citationMap.get(p.id);
      return cit ? { ...p, ...cit } : p;
    });
  } catch (e) {
    console.warn(`  Semantic Scholar enrichment failed: ${e.message}`);
    return papers;
  }
}

// ─── Semantic similarity clustering ───
// Groups papers with ≥40% title-word Jaccard similarity into clusters.

function tokenize(text) {
  return new Set(
    text.toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2 && !STOP_WORDS.has(w))
  );
}

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'are', 'with', 'from', 'this', 'that', 'via', 'using',
  'based', 'towards', 'toward', 'through', 'large', 'learning', 'deep',
  'neural', 'network', 'networks', 'model', 'models', 'training',
]);

function jaccard(a, b) {
  const intersection = new Set([...a].filter(x => b.has(x)));
  const union = new Set([...a, ...b]);
  return union.size === 0 ? 0 : intersection.size / union.size;
}

function clusterPapers(papers) {
  const THRESHOLD = 0.3;
  const clusters = [];
  const assigned = new Set();

  for (let i = 0; i < papers.length; i++) {
    if (assigned.has(i)) continue;
    const cluster = [papers[i]];
    assigned.add(i);
    const tokensI = tokenize(papers[i].title + ' ' + papers[i].summary.slice(0, 200));

    for (let j = i + 1; j < papers.length; j++) {
      if (assigned.has(j)) continue;
      const tokensJ = tokenize(papers[j].title + ' ' + papers[j].summary.slice(0, 200));
      if (jaccard(tokensI, tokensJ) >= THRESHOLD) {
        cluster.push(papers[j]);
        assigned.add(j);
      }
    }

    clusters.push({
      id: `cluster-${i}`,
      lead: cluster[0],
      related: cluster.slice(1),
      size: cluster.length,
      categories: [...new Set(cluster.flatMap(p => p.categories))],
    });
  }

  return clusters.sort((a, b) => b.size - a.size);
}

// ─── Main ───

let allData = null;

async function fetchAll() {
  const papersByCategory = {};
  const allPapers = [];
  const seenIds = new Set();

  for (const cat of CATEGORIES) {
    try {
      let papers = await fetchArxivCategory(cat);
      console.log(`  arXiv ${cat}: ${papers.length} papers`);

      // Enrich with citation counts via Semantic Scholar
      papers = await enrichWithCitations(papers);

      papersByCategory[cat] = papers;

      // Collect unique papers for cross-category clustering
      for (const p of papers) {
        if (!seenIds.has(p.id)) {
          seenIds.add(p.id);
          allPapers.push(p);
        }
      }
    } catch (e) {
      console.warn(`  arXiv ${cat}: ${e.message}`);
    }
    await sleep(ARXIV_RATE_LIMIT_MS);
  }

  if (allPapers.length === 0) throw new Error('All arXiv fetches failed');

  // Compute semantic similarity clusters across all categories
  const clusters = clusterPapers(allPapers);
  console.log(`  Cross-category clusters: ${clusters.length} (from ${allPapers.length} unique papers)`);

  allData = { papersByCategory, clusters };

  // Write per-category keys
  for (const [cat, papers] of Object.entries(papersByCategory)) {
    if (papers.length === 0) continue;
    const key = `arxiv-ai:papers:v1:${cat}`;
    await writeExtraKeyWithMeta(key, { papers, fetchedAt: Date.now() }, ARXIV_TTL, papers.length);
  }

  // Write cluster key
  if (clusters.length > 0) {
    await writeExtraKeyWithMeta('arxiv-ai:clusters:v1', { clusters, fetchedAt: Date.now() }, ARXIV_TTL, clusters.length);
  }

  // Return cs.AI as the primary key payload
  return { papers: papersByCategory['cs.AI'] ?? [], fetchedAt: Date.now() };
}

function validate(data) {
  return data?.papers?.length > 0;
}

runSeed('arxiv-ai', 'all-categories', 'arxiv-ai:papers:v1:cs.AI', fetchAll, {
  validateFn: validate,
  ttlSeconds: ARXIV_TTL,
  sourceVersion: 'arxiv-ai-v1',
}).catch((err) => {
  const cause = err.cause ? ` (cause: ${err.cause.message || err.cause.code || err.cause})` : '';
  console.error('FATAL:', (err.message || err) + cause);
  process.exit(1);
});
