#!/usr/bin/env node
/**
 * health-check-ai-feeds.mjs
 *
 * Validates that all RSS feeds declared in AI_FEEDS are reachable and returning
 * valid XML/RSS content. Run this before deployment or as part of CI to catch
 * dead feeds before they silently starve the AI variant panels.
 *
 * Usage:
 *   node scripts/health-check-ai-feeds.mjs [--timeout=10000] [--concurrency=8] [--tier=primary]
 *
 * Options:
 *   --timeout=<ms>       Per-request timeout in ms (default: 10000)
 *   --concurrency=<n>    Max parallel requests (default: 8)
 *   --tier=primary|all   Only check 'primary' feeds, or 'all' (default: all)
 *   --fail-fast          Exit immediately on first failure
 *
 * Exit codes:
 *   0  All feeds healthy
 *   1  One or more feeds failed
 */

import { readFileSync } from 'fs';
import { pathToFileURL } from 'url';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Parse CLI args ───────────────────────────────────────────────────────────

const args = Object.fromEntries(
  process.argv.slice(2).map(a => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  }),
);

const TIMEOUT_MS   = parseInt(String(args.timeout   ?? 10000), 10);
const CONCURRENCY  = parseInt(String(args.concurrency ?? 8), 10);
const TIER_FILTER  = String(args.tier ?? 'all');  // 'primary' | 'all'
const FAIL_FAST    = Boolean(args['fail-fast']);

const CHROME_UA = 'Mozilla/5.0 (compatible; WorldAIMonitor-HealthCheck/1.0)';

// ─── Load AI_FEEDS from feeds config (static extraction) ─────────────────────
// We can't import TypeScript directly, so we extract feed URLs from the source
// file with a regex rather than running tsc. This keeps the script dependency-free.

const FEEDS_SRC = readFileSync(resolve(__dirname, '../src/config/feeds.ts'), 'utf8');

/**
 * Extract all rss('...') URL arguments from AI_FEEDS block.
 * Captures everything from `const AI_FEEDS` until the closing `};` of that const.
 */
function extractAIFeeds(src) {
  // Find the AI_FEEDS block
  const start = src.indexOf('const AI_FEEDS');
  if (start === -1) throw new Error('Could not locate AI_FEEDS in feeds.ts');

  // Find the matching closing `};` — count braces
  let depth = 0;
  let end = start;
  let inString = false;
  let stringChar = '';
  for (let i = start; i < src.length; i++) {
    const ch = src[i];
    if (inString) {
      if (ch === stringChar && src[i - 1] !== '\\') inString = false;
    } else if (ch === '"' || ch === "'" || ch === '`') {
      inString = true;
      stringChar = ch;
    } else if (ch === '{') {
      depth++;
    } else if (ch === '}') {
      depth--;
      if (depth === 0) { end = i; break; }
    }
  }

  const block = src.slice(start, end + 1);

  // Extract feed objects: name, url, tier
  const feedRe = /\{\s*name:\s*'([^']+)'[^}]*?(?:tier:\s*'(primary|secondary)')?[^}]*?url:\s*rss\('([^']+)'\)[^}]*?\}/gs;
  const feeds = [];
  for (const m of block.matchAll(feedRe)) {
    feeds.push({ name: m[1], tier: m[2] ?? 'secondary', url: m[3] });
  }

  // Fallback: simpler pattern for feeds where url comes before tier
  const feedRe2 = /\{\s*name:\s*'([^']+)'[^}]*?url:\s*rss\('([^']+)'\)[^}]*?(?:tier:\s*'(primary|secondary)')?[^}]*?\}/gs;
  for (const m of block.matchAll(feedRe2)) {
    const exists = feeds.some(f => f.url === m[2]);
    if (!exists) feeds.push({ name: m[1], tier: m[3] ?? 'secondary', url: m[2] });
  }

  return feeds;
}

// ─── Health check logic ───────────────────────────────────────────────────────

async function checkFeed({ name, url, tier }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'User-Agent': CHROME_UA, Accept: 'application/rss+xml, application/xml, text/xml, */*' },
      signal: controller.signal,
      redirect: 'follow',
    });
    clearTimeout(timer);

    if (!res.ok) {
      return { name, url, tier, ok: false, reason: `HTTP ${res.status} ${res.statusText}` };
    }

    const text = await res.text();
    const isXml = text.trimStart().startsWith('<');
    const hasItems = text.includes('<item>') || text.includes('<entry>') || text.includes('<channel>');

    if (!isXml) {
      return { name, url, tier, ok: false, reason: 'Response is not XML' };
    }
    if (!hasItems) {
      return { name, url, tier, ok: false, reason: 'No <item>/<entry>/<channel> found — empty feed?' };
    }

    // Count items as a sanity check
    const itemCount = (text.match(/<item>/g) ?? []).length + (text.match(/<entry>/g) ?? []).length;
    return { name, url, tier, ok: true, itemCount };

  } catch (err) {
    clearTimeout(timer);
    const reason = err.name === 'AbortError' ? `Timeout after ${TIMEOUT_MS}ms` : String(err.message ?? err);
    return { name, url, tier, ok: false, reason };
  }
}

async function runWithConcurrency(tasks, limit) {
  const results = [];
  const queue = [...tasks];

  async function worker() {
    while (queue.length > 0) {
      const task = queue.shift();
      if (!task) break;
      const result = await task();
      results.push(result);
      if (FAIL_FAST && !result.ok) {
        queue.length = 0; // drain queue
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, worker));
  return results;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🔍 World AI Monitor — RSS Feed Health Check');
  console.log(`   Timeout: ${TIMEOUT_MS}ms | Concurrency: ${CONCURRENCY} | Tier filter: ${TIER_FILTER}\n`);

  let feeds;
  try {
    feeds = extractAIFeeds(FEEDS_SRC);
  } catch (err) {
    console.error('❌ Failed to parse AI_FEEDS from feeds.ts:', err.message);
    process.exit(1);
  }

  if (TIER_FILTER === 'primary') {
    feeds = feeds.filter(f => f.tier === 'primary');
  }

  console.log(`   Checking ${feeds.length} feeds…\n`);

  const tasks = feeds.map(feed => () => checkFeed(feed));
  const results = await runWithConcurrency(tasks, CONCURRENCY);

  // ─── Report ───────────────────────────────────────────────────────────────

  const passed = results.filter(r => r.ok);
  const failed = results.filter(r => !r.ok);

  if (passed.length > 0) {
    console.log(`✅ Healthy (${passed.length})`);
    for (const r of passed) {
      const items = r.itemCount !== undefined ? ` [${r.itemCount} items]` : '';
      console.log(`   ✓ [${r.tier.padEnd(9)}] ${r.name}${items}`);
    }
  }

  if (failed.length > 0) {
    console.log(`\n❌ Failed (${failed.length})`);
    for (const r of failed) {
      console.log(`   ✗ [${r.tier.padEnd(9)}] ${r.name}`);
      console.log(`         URL: ${r.url}`);
      console.log(`         Reason: ${r.reason}`);
    }
  }

  console.log(`\n─── Summary ──────────────────────────────────────────`);
  console.log(`   Total:  ${results.length}`);
  console.log(`   Passed: ${passed.length}`);
  console.log(`   Failed: ${failed.length}`);

  if (failed.length > 0) {
    console.log('\n⚠️  Action required: update or replace dead feeds in src/config/feeds.ts');
    process.exit(1);
  }

  console.log('\n🎉 All feeds are live and returning valid RSS data.');
  process.exit(0);
}

main().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
