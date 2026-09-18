import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { test } from 'node:test'

import { parsePracticeRows, renderPracticeIndex } from '../gen.mjs'
import { run } from './generated-fresh.mjs'

const root = process.cwd()
const fixturesDir = path.join(root, 'scripts', 'checks', 'fixtures', 'generated-fresh')

function loadFixture(rel) {
  return readFileSync(path.join(fixturesDir, `${rel}.fixture`), 'utf8').replace(/\r\n/g, '\n')
}

test('positive fixture notice tells the maintainer to run pnpm gen', () => {
  const files = [
    { path: 'checks.json', text: loadFixture('checks.json') },
    { path: 'docs/maintain/authoring.md', text: loadFixture('docs/maintain/authoring.md') },
  ]
  const { findings, notices } = run({ files })
  assert.ok(findings.length > 0)
  assert.ok(notices.some((n) => n.includes('run: pnpm gen')))
})

test('negative fixture has no findings and no notice', () => {
  const files = [
    { path: 'checks.json', text: loadFixture('negative/checks.json') },
    { path: 'docs/maintain/authoring.md', text: loadFixture('negative/docs/maintain/authoring.md') },
  ]
  const result = run({ files })
  assert.equal(result.findings.length, 0)
  assert.equal(result.notices, undefined)
})

test('stale practices/index.md produces an index-stale finding', () => {
  const files = [{ path: 'practices/index.md', text: loadFixture('practices/index.md') }]
  const { findings, notices } = run({ files })
  assert.ok(findings.some((f) => f.ruleId === 'generated-fresh:index-stale'))
  assert.ok(notices.some((n) => n.includes('practices/index.md') && n.includes('run: pnpm gen')))
})

test('fresh practices/index.md (no practice files present) produces no finding', () => {
  const files = [{ path: 'practices/index.md', text: loadFixture('negative/practices/index.md') }]
  const result = run({ files })
  assert.equal(result.findings.length, 0)
})

test('stale README.md generated blocks produce a readme-stale finding', () => {
  const files = [{ path: 'README.md', text: loadFixture('README.md') }]
  const { findings, notices } = run({ files })
  assert.ok(findings.some((f) => f.ruleId === 'generated-fresh:readme-stale'))
  assert.ok(notices.some((n) => n.includes('README.md') && n.includes('run: pnpm gen')))
})

test('fresh README.md generated blocks (no practice files present) produce no finding', () => {
  const files = [{ path: 'README.md', text: loadFixture('negative/README.md') }]
  const result = run({ files })
  assert.equal(result.findings.length, 0)
})

test('parsePracticeRows excludes a draft practice from the index', () => {
  const files = [
    {
      path: 'practices/0001-active-one.md',
      text: [
        '---',
        'id: "0001"',
        'title: Active one',
        'status: active',
        'topic: instruction-files',
        'applies_to:',
        '  - general',
        'rule: An active rule.',
        'license: CC-BY-4.0',
        'sources:',
        '  - url: https://example.com/a',
        '    kind: primary',
        '    confidence: verified',
        '    verified_on: "2026-01-02"',
        '    summary: A summary.',
        '    quote: A quote.',
        '---',
        '',
        '## Why',
        '',
        'Because.',
        '',
      ].join('\n'),
    },
    {
      path: 'practices/0002-draft-one.md',
      text: [
        '---',
        'id: "0002"',
        'title: Draft one',
        'status: draft',
        'topic: instruction-files',
        'applies_to:',
        '  - general',
        'rule: A draft rule.',
        'license: CC-BY-4.0',
        'sources:',
        '  - url: https://example.com/b',
        '    kind: primary',
        '    confidence: verified',
        '    verified_on: "2026-01-01"',
        '    summary: A summary.',
        '    quote: A quote.',
        '---',
        '',
        '## Why',
        '',
        'Because.',
        '',
      ].join('\n'),
    },
  ]

  const rows = parsePracticeRows(files)
  assert.deepEqual(
    rows.map((r) => r.id),
    ['0001'],
  )

  const rendered = renderPracticeIndex(rows)
  assert.ok(rendered.includes('0001'))
  assert.ok(!rendered.includes('0002'))
  assert.ok(!rendered.includes('Draft one'))
})
