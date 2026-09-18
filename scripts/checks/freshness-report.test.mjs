import assert from 'node:assert/strict'
import { test } from 'node:test'

import { computeFreshness, renderMarkdown, run } from './freshness-report.mjs'

function contentFile(relPath, { id = '0001', status = 'active', verifiedOn = '2026-01-01' } = {}) {
  return {
    path: relPath,
    text: [
      '---',
      `id: "${id}"`,
      'title: Sample',
      `status: ${status}`,
      'sources:',
      '  - url: https://example.com/docs',
      '    kind: primary',
      `    verified_on: "${verifiedOn}"`,
      '---',
      '',
    ].join('\n'),
  }
}

const NOW = Date.UTC(2026, 8, 19) // 2026-09-19, matches the plan's stated "today"

test('a file verified 181 days ago is stale', () => {
  const file = contentFile('practices/0001-sample.md', { verifiedOn: '2026-03-13' })
  const { checked, stale } = computeFreshness([file], NOW)
  assert.equal(checked, 1)
  assert.equal(stale.length, 1)
  assert.equal(stale[0].days, 190)
})

test('a file verified 180 days ago is not stale', () => {
  const file = contentFile('practices/0001-sample.md', { verifiedOn: '2026-03-23' })
  const { checked, stale } = computeFreshness([file], NOW)
  assert.equal(checked, 1)
  assert.equal(stale.length, 0)
})

test('a draft file is not checked regardless of its verified_on age', () => {
  const file = contentFile('practices/0001-sample.md', { status: 'draft', verifiedOn: '2000-01-01' })
  const { checked, stale } = computeFreshness([file], NOW)
  assert.equal(checked, 0)
  assert.equal(stale.length, 0)
})

test('a file with no sources is not checked', () => {
  const file = { path: 'practices/0001-sample.md', text: '---\nid: "0001"\nstatus: active\n---\n' }
  const { checked } = computeFreshness([file], NOW)
  assert.equal(checked, 0)
})

test('the oldest of several verified_on dates wins', () => {
  const file = {
    path: 'practices/0001-sample.md',
    text: [
      '---',
      'id: "0001"',
      'status: active',
      'sources:',
      '  - url: https://example.com/a',
      '    kind: primary',
      '    verified_on: "2026-01-01"',
      '  - url: https://example.com/b',
      '    kind: primary',
      '    verified_on: "2025-01-01"',
      '---',
      '',
    ].join('\n'),
  }
  const { stale } = computeFreshness([file], NOW)
  assert.equal(stale[0].days, Math.floor((NOW - Date.UTC(2025, 0, 1)) / 86400000))
})

test('run() returns one finding per stale file plus detail and summary notices', () => {
  const stale = contentFile('practices/0001-sample.md', { verifiedOn: '2000-01-01' })
  const fresh = contentFile('practices/0002-sample.md', { id: '0002', verifiedOn: new Date().toISOString().slice(0, 10) })
  const { findings, notices } = run({ files: [stale, fresh] })
  assert.equal(findings.length, 1)
  assert.equal(findings[0].ruleId, 'freshness-report:stale')
  assert.ok(notices.some((n) => n.startsWith('practices/0001-sample.md 0001 ')))
  assert.equal(notices.at(-1), 'stale: 1 / checked: 2')
})

test('renderMarkdown produces a table with a trailing summary line', () => {
  const md = renderMarkdown({ checked: 2, stale: [{ path: 'practices/0001-sample.md', id: '0001', days: 200 }] })
  assert.match(md, /\| `practices\/0001-sample\.md` \| 0001 \| 200 \|/)
  assert.match(md, /stale: 1 \/ checked: 2$/)
})
