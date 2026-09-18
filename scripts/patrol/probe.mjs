import { TIMEOUT_MS, USER_AGENT, md5Hex } from './fetch.mjs'

// Labels only, never the matched substring itself: the probe's output is a
// public surface (CI logs, an Issue comment), so this must never carry a
// fragment of the fetched body — see format.mjs's same constraint.
const VOLATILE_PATTERN_LABELS = {
  'iso-timestamp': /\b\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
  lastBuildDate: /lastBuildDate/i,
  generated: /\bgenerated\b/i,
  nonce: /\bnonce\b/i,
  buildId: /\bbuildId\b/i,
}

export function matchedPatternLabels(text) {
  return Object.entries(VOLATILE_PATTERN_LABELS)
    .filter(([, pattern]) => pattern.test(text))
    .map(([label]) => label)
}

async function getOnce(url, fetchImpl) {
  const res = await fetchImpl(url, {
    redirect: 'follow',
    headers: { 'User-Agent': USER_AGENT },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  const body = await res.text()
  return { status: res.status, etag: res.headers.get('etag'), body }
}

// volatile is decided empirically (does the same URL return different bytes
// two fetches apart), not by pattern presence alone: a page can contain the
// literal word "nonce" in static markup and still be byte-stable across
// requests, and pattern-only detection would wrongly block registering it.
export async function probeUrl(
  url,
  { fetchImpl = fetch, waitMs = 3000, sleepImpl = (ms) => new Promise((r) => setTimeout(r, ms)) } = {},
) {
  const first = await getOnce(url, fetchImpl)
  await sleepImpl(waitMs)
  const second = await getOnce(url, fetchImpl)

  const volatile = md5Hex(first.body) !== md5Hex(second.body)
  const recommendedMethod = volatile ? (first.etag ? 'etag' : 'none') : 'md5'
  const patterns = volatile ? matchedPatternLabels(first.body) : []

  return { url, volatile, recommendedMethod, patterns }
}
