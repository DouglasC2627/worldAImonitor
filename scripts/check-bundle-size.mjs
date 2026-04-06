#!/usr/bin/env node
/**
 * check-bundle-size.mjs
 *
 * Verifies that the built JS bundle for a given variant stays under a size limit.
 * Run after `npm run build:ai` (or the equivalent) in CI to catch regressions.
 *
 * Usage:
 *   node scripts/check-bundle-size.mjs [--max-kb=2048] [--dir=dist/assets]
 *
 * Exit codes:
 *   0  Bundle is within limits
 *   1  Bundle exceeds limit or dist directory not found
 */

import { readdirSync, statSync, existsSync } from 'fs';
import { resolve, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── CLI args ─────────────────────────────────────────────────────────────────

const args = Object.fromEntries(
  process.argv.slice(2).map(a => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  }),
);

const MAX_KB   = parseInt(String(args['max-kb'] ?? 2048), 10);
const DIST_DIR = resolve(__dirname, '..', String(args.dir ?? 'dist/assets'));
const MAX_BYTES = MAX_KB * 1024;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

if (!existsSync(DIST_DIR)) {
  console.error(`❌ dist directory not found: ${DIST_DIR}`);
  console.error('   Run "npm run build:ai" first.');
  process.exit(1);
}

const jsFiles = readdirSync(DIST_DIR)
  .filter(f => extname(f) === '.js')
  .map(f => ({ name: f, path: resolve(DIST_DIR, f), size: statSync(resolve(DIST_DIR, f)).size }))
  .sort((a, b) => b.size - a.size);

if (jsFiles.length === 0) {
  console.error(`❌ No .js files found in ${DIST_DIR}`);
  process.exit(1);
}

const totalBytes = jsFiles.reduce((sum, f) => sum + f.size, 0);
const totalKB = totalBytes / 1024;

console.log('📦 Bundle Size Report');
console.log(`   Directory: ${DIST_DIR}`);
console.log(`   Limit:     ${MAX_KB} KB (${formatBytes(MAX_BYTES)})\n`);

// Print top 10 largest files
console.log('   Largest JS chunks:');
for (const f of jsFiles.slice(0, 10)) {
  const bar = '█'.repeat(Math.min(30, Math.round((f.size / jsFiles[0].size) * 30)));
  console.log(`   ${bar.padEnd(30)} ${formatBytes(f.size).padStart(10)}  ${f.name}`);
}
if (jsFiles.length > 10) {
  console.log(`   … and ${jsFiles.length - 10} more files`);
}

console.log(`\n   Total JS: ${formatBytes(totalBytes)} (${jsFiles.length} files)`);

if (totalBytes > MAX_BYTES) {
  console.log(`\n❌ FAIL: Total JS size ${formatBytes(totalBytes)} exceeds limit of ${formatBytes(MAX_BYTES)}`);
  console.log('   Investigate large chunks — ensure AI variant excludes geopolitical layers.');
  console.log('   Tip: run "npx vite-bundle-visualizer" for a treemap breakdown.');
  process.exit(1);
}

console.log(`\n✅ PASS: Total JS size ${formatBytes(totalBytes)} is within the ${MAX_KB} KB limit.`);
process.exit(0);
