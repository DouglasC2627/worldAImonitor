#!/usr/bin/env node

/**
 * Seed AI safety incidents and vulnerability database updates.
 *
 * Sources:
 *  - AI Incident Database (AIID) public API — new incident submissions
 *  - AVID (AI Vulnerability Database) GitHub releases feed
 *  - Alignment Forum RSS — red-teaming result publications
 *
 * Redis keys written:
 *   ai-safety:incidents:v1     — AI incidents (TTL 12h)
 *   ai-safety:vulnerabilities:v1 — AI vulnerabilities (TTL 12h)
 */

import { loadEnvFile, CHROME_UA, runSeed, writeExtraKeyWithMeta, sleep } from './_seed-utils.mjs';

loadEnvFile(import.meta.url);

const SAFETY_TTL = 43200; // 12h
const AIID_API = 'https://incidentdatabase.ai/api/incidents';

// ─── AI Incident Database ───

async function fetchAIIDIncidents() {
  try {
    // AIID has a public GraphQL API
    const query = `{
      incidents(limit: 20, sort: { date_modified: DESC }) {
        incident_id
        title
        description
        date
        reports {
          title
          url
          source_domain
        }
        AllegedDeployerOfAISystem { name }
        AllegedDeveloperOfAISystem { name }
      }
    }`;

    const resp = await fetch('https://incidentdatabase.ai/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': CHROME_UA,
        Accept: 'application/json',
      },
      body: JSON.stringify({ query }),
      signal: AbortSignal.timeout(15_000),
    });

    if (!resp.ok) {
      console.warn(`  AIID: HTTP ${resp.status}`);
      return [];
    }

    const data = await resp.json();
    const incidents = data?.data?.incidents ?? [];
    console.log(`  AIID: ${incidents.length} incidents`);

    return incidents.map(inc => ({
      id: `aiid-${inc.incident_id}`,
      title: inc.title || '',
      description: (inc.description || '').slice(0, 500),
      date: inc.date || '',
      systems: [
        ...(inc.AllegedDeployerOfAISystem ?? []).map(e => e.name),
        ...(inc.AllegedDeveloperOfAISystem ?? []).map(e => e.name),
      ].filter(Boolean),
      reportUrl: inc.reports?.[0]?.url || `https://incidentdatabase.ai/cite/${inc.incident_id}`,
      source: 'aiid',
      severity: 'unknown',
    })).filter(i => i.title);
  } catch (e) {
    console.warn(`  AIID: ${e.message}`);
    return [];
  }
}

// ─── AVID vulnerabilities via GitHub releases ───

async function fetchAVIDVulnerabilities() {
  try {
    // AVID database is hosted on GitHub; poll issues/releases feed
    const resp = await fetch(
      'https://api.github.com/repos/avidml/avid-db/issues?state=open&labels=vulnerability&sort=created&per_page=20',
      {
        headers: { Accept: 'application/vnd.github+json', 'User-Agent': CHROME_UA },
        signal: AbortSignal.timeout(10_000),
      },
    );
    if (!resp.ok) { console.warn(`  AVID: HTTP ${resp.status}`); return []; }
    const issues = await resp.json();
    if (!Array.isArray(issues)) return [];
    console.log(`  AVID: ${issues.length} vulnerabilities`);

    return issues.map(issue => ({
      id: `avid-${issue.number}`,
      title: issue.title || '',
      description: (issue.body || '').slice(0, 400),
      date: issue.created_at ? issue.created_at.split('T')[0] : '',
      url: issue.html_url || '',
      source: 'avid',
      labels: (issue.labels ?? []).map(l => l.name),
    })).filter(v => v.title);
  } catch (e) {
    console.warn(`  AVID: ${e.message}`);
    return [];
  }
}

// ─── Alignment Forum / LessWrong red-teaming posts ───

async function fetchAlignmentForumPosts() {
  const RSS_URL = 'https://www.alignmentforum.org/feed.xml';
  const SAFETY_KEYWORDS = ['red team', 'red-team', 'jailbreak', 'safety incident', 'alignment failure', 'dangerous capability', 'eval', 'evaluation'];

  try {
    const resp = await fetch(RSS_URL, {
      headers: { 'User-Agent': CHROME_UA, Accept: 'application/rss+xml, text/xml, */*' },
      signal: AbortSignal.timeout(10_000),
    });
    if (!resp.ok) { console.warn(`  Alignment Forum: HTTP ${resp.status}`); return []; }
    const xml = await resp.text();

    const posts = [];
    for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
      const block = m[1];
      const title = (block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/)?.[1] || '').trim();
      const link = block.match(/<link>(.*?)<\/link>/)?.[1]?.trim() || '';
      const pubDate = block.match(/<pubDate>(.*?)<\/pubDate>/)?.[1]?.trim() || '';
      const desc = (block.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)?.[1] || '').trim().slice(0, 300);

      if (!title) continue;
      const lower = title.toLowerCase() + ' ' + desc.toLowerCase();
      if (!SAFETY_KEYWORDS.some(kw => lower.includes(kw))) continue;

      posts.push({ id: `af-${encodeURIComponent(link).slice(0, 30)}`, title, url: link, date: pubDate, description: desc, source: 'alignment-forum' });
    }

    console.log(`  Alignment Forum: ${posts.length} safety-relevant posts`);
    return posts;
  } catch (e) {
    console.warn(`  Alignment Forum: ${e.message}`);
    return [];
  }
}

// ─── Main ───

async function fetchAll() {
  const [incidents, vulnerabilities, forumPosts] = await Promise.allSettled([
    fetchAIIDIncidents(),
    fetchAVIDVulnerabilities(),
    fetchAlignmentForumPosts(),
  ]);

  const incidentsData = incidents.status === 'fulfilled' ? incidents.value : [];
  const vulnsData = vulnerabilities.status === 'fulfilled' ? vulnerabilities.value : [];
  const forumData = forumPosts.status === 'fulfilled' ? forumPosts.value : [];

  if (vulnerabilities.status === 'rejected') console.warn(`  AVID failed: ${vulnerabilities.reason?.message}`);
  if (forumPosts.status === 'rejected') console.warn(`  Forum failed: ${forumPosts.reason?.message}`);

  if (vulnsData.length > 0 || forumData.length > 0) {
    await writeExtraKeyWithMeta(
      'ai-safety:vulnerabilities:v1',
      { vulnerabilities: vulnsData, forumPosts: forumData, fetchedAt: Date.now() },
      SAFETY_TTL,
      vulnsData.length + forumData.length,
    );
  }

  const allIncidents = [...incidentsData, ...forumData.slice(0, 5).map(p => ({
    id: p.id, title: p.title, description: p.description, date: p.date,
    systems: [], reportUrl: p.url, source: p.source, severity: 'unknown',
  }))];

  if (allIncidents.length === 0) throw new Error('No AI safety data fetched');
  return { incidents: allIncidents, fetchedAt: Date.now() };
}

function validate(data) {
  return Array.isArray(data?.incidents) && data.incidents.length > 0;
}

runSeed('ai-safety', 'incidents', 'ai-safety:incidents:v1', fetchAll, {
  validateFn: validate,
  ttlSeconds: SAFETY_TTL,
  sourceVersion: 'ai-safety-v1',
}).catch((err) => {
  const cause = err.cause ? ` (cause: ${err.cause.message || err.cause.code || err.cause})` : '';
  console.error('FATAL:', (err.message || err) + cause);
  process.exit(1);
});
