import assert from 'node:assert/strict'
import { after, test } from 'node:test'

import { run } from './release-check.mjs'

// release-check.mjs's run() takes files directly ({path, text}[]) with no FS
// access, so these tests build them inline rather than through an on-disk
// fixture directory (see registry-check.test.mjs for the same style).
//
// The marketplace entry's version ("2.0.0") deliberately differs from
// plugin.json's version ("1.0.0"), so release-check:version-mismatch always
// fires here regardless of COMPASS_RELEASE_TAG.
function sampleFiles() {
  return [
    {
      path: '.claude-plugin/marketplace.json',
      text: JSON.stringify({
        name: 'sample-marketplace',
        description: 'Sample.',
        owner: { name: 'sample' },
        plugins: [{ name: 'sample', source: './plugins/sample', description: 'Sample.', version: '2.0.0' }],
      }),
    },
    {
      path: 'plugins/sample/.claude-plugin/plugin.json',
      text: JSON.stringify({
        name: 'sample',
        version: '1.0.0',
        description: 'Sample.',
        license: 'MIT',
        author: { name: 'sample' },
      }),
    },
    { path: 'plugins/sample/LICENSE', text: 'MIT License (sample).' },
    { path: 'plugins/sample/LICENSE-DOCS', text: 'CC BY 4.0 License (sample).' },
  ]
}

const savedEnv = { COMPASS_RELEASE_TAG: process.env.COMPASS_RELEASE_TAG }
after(() => {
  if (savedEnv.COMPASS_RELEASE_TAG === undefined) delete process.env.COMPASS_RELEASE_TAG
  else process.env.COMPASS_RELEASE_TAG = savedEnv.COMPASS_RELEASE_TAG
})

test('COMPASS_RELEASE_TAG unset reports only the pre-existing version-mismatch, not tag-mismatch', () => {
  delete process.env.COMPASS_RELEASE_TAG
  const { findings } = run({ files: sampleFiles() })
  assert.deepEqual(findings.map((f) => f.ruleId), ['release-check:version-mismatch'])
})

// Both this and the "unset" case above take the same falsy branch in
// release-check.mjs, but both are genuinely reachable, just via different
// callers: this repository's own CI (.github/workflows/ci.yml) sets
// COMPASS_RELEASE_TAG to '' on the `pnpm check` step for every run that
// isn't a tag push, while a local invocation that never sets the variable
// (including `pnpm test`, which carries no such env override in CI either)
// leaves it unset.
test('COMPASS_RELEASE_TAG set to an empty string reports only the pre-existing version-mismatch, not tag-mismatch', () => {
  process.env.COMPASS_RELEASE_TAG = ''
  const { findings } = run({ files: sampleFiles() })
  assert.deepEqual(findings.map((f) => f.ruleId), ['release-check:version-mismatch'])
})

test('COMPASS_RELEASE_TAG matching plugin.json\'s version (with a leading "v") does not add tag-mismatch', () => {
  process.env.COMPASS_RELEASE_TAG = 'v1.0.0'
  const { findings } = run({ files: sampleFiles() })
  assert.deepEqual(findings.map((f) => f.ruleId), ['release-check:version-mismatch'])
})

test('COMPASS_RELEASE_TAG matching plugin.json\'s version (without a leading "v") does not add tag-mismatch', () => {
  process.env.COMPASS_RELEASE_TAG = '1.0.0'
  const { findings } = run({ files: sampleFiles() })
  assert.deepEqual(findings.map((f) => f.ruleId), ['release-check:version-mismatch'])
})

test('COMPASS_RELEASE_TAG matching only the marketplace entry\'s version adds tag-mismatch, proving the branch reads plugin.json\'s version', () => {
  process.env.COMPASS_RELEASE_TAG = 'v2.0.0'
  const { findings } = run({ files: sampleFiles() })
  assert.deepEqual(
    findings.map((f) => f.ruleId).sort(),
    ['release-check:tag-mismatch', 'release-check:version-mismatch'],
  )
})
