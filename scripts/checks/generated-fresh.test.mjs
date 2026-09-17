import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { test } from 'node:test'

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
