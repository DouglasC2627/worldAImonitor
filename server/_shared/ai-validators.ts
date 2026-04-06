/**
 * Runtime schema validators for AI domain data models.
 *
 * These lightweight guards are used by AI API handlers to filter out malformed
 * entries from Redis before forwarding to clients. No external dependencies —
 * all checks are plain TypeScript predicates.
 *
 * Complement the compile-time type guards in src/types/index.ts. The server-side
 * versions operate on raw `unknown` values coming out of JSON.parse / Redis.
 */

// ─── Primitives ───────────────────────────────────────────────────────────────

function isString(v: unknown): v is string {
  return typeof v === 'string';
}

function isNumber(v: unknown): v is number {
  return typeof v === 'number' && isFinite(v);
}

function isArray(v: unknown): v is unknown[] {
  return Array.isArray(v);
}

function isObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}

/** Validates a date value expressed as an ISO string, ms timestamp, or Date instance. */
function isDateLike(v: unknown): boolean {
  if (v instanceof Date) return !isNaN(v.getTime());
  if (typeof v === 'string') return !isNaN(Date.parse(v));
  if (typeof v === 'number') return isFinite(v) && v > 0;
  return false;
}

// ─── AI Domain Validators ─────────────────────────────────────────────────────

export function validateAIFundingRound(v: unknown): boolean {
  if (!isObject(v)) return false;
  return (
    isString(v['company']) && v['company'].length > 0 &&
    isNumber(v['amount']) && v['amount'] >= 0 &&
    (v['amountUnit'] === 'K' || v['amountUnit'] === 'M' || v['amountUnit'] === 'B') &&
    isArray(v['investors']) &&
    isDateLike(v['date']) &&
    isString(v['aiVertical']) && v['aiVertical'].length > 0
  );
}

export function validateAILabProfile(v: unknown): boolean {
  if (!isObject(v)) return false;
  return (
    isString(v['id']) && v['id'].length > 0 &&
    isString(v['name']) && v['name'].length > 0 &&
    isString(v['shortName']) &&
    isNumber(v['activityScore']) &&
    isString(v['website'])
  );
}

export function validateAIBenchmarkScore(v: unknown): boolean {
  if (!isObject(v)) return false;
  return (
    isString(v['benchmark']) && v['benchmark'].length > 0 &&
    isString(v['model']) && v['model'].length > 0 &&
    isString(v['lab']) &&
    isNumber(v['score']) &&
    typeof v['isSOTA'] === 'boolean'
  );
}

export function validateAIResearchPaper(v: unknown): boolean {
  if (!isObject(v)) return false;
  return (
    isString(v['arxivId']) && v['arxivId'].length > 0 &&
    isString(v['title']) && v['title'].length > 0 &&
    isArray(v['authors']) &&
    isString(v['abstract']) &&
    isArray(v['categories']) &&
    isDateLike(v['submittedDate'])
  );
}

export function validateAISafetyIncident(v: unknown): boolean {
  if (!isObject(v)) return false;
  return (
    isString(v['id']) && v['id'].length > 0 &&
    isString(v['title']) && v['title'].length > 0 &&
    isString(v['system']) &&
    isString(v['category']) &&
    isString(v['severity']) &&
    isString(v['sourceLink'])
  );
}

export function validateAIPolicyEvent(v: unknown): boolean {
  if (!isObject(v)) return false;
  return (
    isString(v['title']) && v['title'].length > 0 &&
    isString(v['jurisdiction']) &&
    isString(v['body']) &&
    isString(v['status']) &&
    isString(v['link'])
  );
}

// ─── Filter helper ────────────────────────────────────────────────────────────

/**
 * Filters an unknown array with a validator, logging the count of dropped items.
 * Returns a typed array of valid items.
 */
export function filterValid<T>(
  arr: unknown,
  validator: (v: unknown) => boolean,
  label: string,
): T[] {
  if (!isArray(arr)) return [];
  const valid = arr.filter(validator) as T[];
  const dropped = arr.length - valid.length;
  if (dropped > 0) {
    console.warn(`[ai-validators] ${label}: dropped ${dropped}/${arr.length} malformed entries`);
  }
  return valid;
}
