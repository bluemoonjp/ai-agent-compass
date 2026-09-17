import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { after, before, test } from 'node:test'

import { runCheck } from '../lib/runner.mjs'

const root = process.cwd()
const check = { id: 'forbidden-patterns', script: 'scripts/checks/forbidden-patterns.mjs', blocking: true }

// The tests below that call runCheck() in-process (not through runCli's
// spawnSync, which builds its own env explicitly) must not inherit this
// process's CI/COMPASS_PRIVATE_PATTERNS — a CI runner sets CI=true itself,
// which would make the private-patterns branch fire for reasons unrelated
// to what these tests check.
const savedEnv = { CI: process.env.CI, COMPASS_PRIVATE_PATTERNS: process.env.COMPASS_PRIVATE_PATTERNS }
before(() => {
  delete process.env.CI
  delete process.env.COMPASS_PRIVATE_PATTERNS
})
after(() => {
  for (const [key, value] of Object.entries(savedEnv)) {
    if (value === undefined) delete process.env[key]
    else process.env[key] = value
  }
})

const SECRET_PATTERN = 'COMPASS_TEST_SECRET_PATTERN_9F3K2LQZ'
const SECRET_PROBE = 'COMPASS_TEST_SECRET_PROBE_7XJ4MNBV'

function runCli(overrides, unset = []) {
  const env = { ...process.env, ...overrides }
  for (const key of unset) delete env[key]
  return spawnSync(process.execPath, [path.join(root, 'scripts', 'check.mjs')], {
    cwd: root,
    encoding: 'utf8',
    env,
  })
}

// `::add-mask::<value>` is a GitHub Actions workflow command: the runner
// scrubs that value from every subsequent line of the *rendered* log, but a
// raw stdout capture (as in this test) still shows the command line itself.
// Strip those lines before asserting, so this test checks what the check's
// own logic prints (findings, fixed wording) rather than the mask registration.
function stripMaskCommands(output) {
  return output
    .split('\n')
    .filter((line) => !line.startsWith('::add-mask::'))
    .join('\n')
}

function assertNoLeak(result, ...secrets) {
  const stdout = stripMaskCommands(result.stdout)
  const stderr = stripMaskCommands(result.stderr)
  for (const secret of secrets) {
    assert.doesNotMatch(stdout, new RegExp(secret), 'stdout must not contain the secret value')
    assert.doesNotMatch(stderr, new RegExp(secret), 'stderr must not contain the secret value')
  }
}

test('CI + unset COMPASS_PRIVATE_PATTERNS fails closed', () => {
  const result = runCli({ CI: 'true' }, ['COMPASS_PRIVATE_PATTERNS'])
  assert.equal(result.status, 1)
  assert.match(result.stdout, /forbidden-patterns:env-unset/)
})

test('CI + invalid JSON fails closed without leaking the value', () => {
  const result = runCli({ CI: 'true', COMPASS_PRIVATE_PATTERNS: `not json ${SECRET_PATTERN}` })
  assert.equal(result.status, 1)
  assert.match(result.stdout, /forbidden-patterns:invalid-json/)
  assertNoLeak(result, SECRET_PATTERN)
})

test('CI + an invalid regular expression fails closed without leaking the value', () => {
  const payload = JSON.stringify({ patterns: [`(${SECRET_PATTERN}`], probe: SECRET_PROBE })
  const result = runCli({ CI: 'true', COMPASS_PRIVATE_PATTERNS: payload })
  assert.equal(result.status, 1)
  assert.match(result.stdout, /forbidden-patterns:invalid-regexp/)
  assertNoLeak(result, SECRET_PATTERN, SECRET_PROBE)
})

test('CI + a probe matching no pattern fails closed without leaking values', () => {
  const payload = JSON.stringify({ patterns: [SECRET_PATTERN], probe: SECRET_PROBE })
  const result = runCli({ CI: 'true', COMPASS_PRIVATE_PATTERNS: payload })
  assert.equal(result.status, 1)
  assert.match(result.stdout, /forbidden-patterns:probe-mismatch/)
  assertNoLeak(result, SECRET_PATTERN, SECRET_PROBE)
})

test('local run without CI and without the env var is skipped, not failed', () => {
  const result = runCli({}, ['CI', 'COMPASS_PRIVATE_PATTERNS'])
  assert.equal(result.status, 0)
  assert.match(result.stdout, /private-patterns: skipped \(env unset\)/)
})

test('--strict enforces the env var locally the same way CI does', () => {
  const result = runCli({}, ['CI', 'COMPASS_PRIVATE_PATTERNS'])
  assert.equal(result.status, 0)
  const strictResult = spawnSync(
    process.execPath,
    [path.join(root, 'scripts', 'check.mjs'), '--strict'],
    { cwd: root, encoding: 'utf8', env: (() => {
      const env = { ...process.env }
      delete env.CI
      delete env.COMPASS_PRIVATE_PATTERNS
      return env
    })() },
  )
  assert.equal(strictResult.status, 1)
  assert.match(strictResult.stdout, /forbidden-patterns:env-unset/)
})

// Built from parts so this test file's own source text does not itself trip
// the email-address pattern when the repository scans its own tracked files.
const ALLOWLISTED_TRAILER_EMAIL = ['noreply', 'anthropic.com'].join('@')
const NON_ALLOWLISTED_TRAILER_EMAIL = ['someone', 'example.com'].join('@')

test('a trailer line with an allowlisted noreply domain is not flagged', async () => {
  const message = `Fix docs\n\nCo-Authored-By: Claude Sonnet 5 <${ALLOWLISTED_TRAILER_EMAIL}>`
  const { findings } = await runCheck(root, check, { files: [], messages: [message] })
  assert.equal(findings.length, 0)
})

test('a non-allowlisted email in a commit message is still flagged', async () => {
  const message = `Fix docs\n\nCo-Authored-By: Someone <${NON_ALLOWLISTED_TRAILER_EMAIL}>`
  const { findings } = await runCheck(root, check, { files: [], messages: [message] })
  assert.ok(findings.length > 0)
})

test('reports how many commits were checked', async () => {
  const { notices } = await runCheck(root, check, { files: [], messages: ['a', 'b', 'c'] })
  assert.ok(notices.includes('commits checked: 3'))
})
