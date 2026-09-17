import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { test } from 'node:test'

const root = process.cwd()

const SECRET_PATTERN = 'COMPASS_TEST_PASTE_SECRET_PATTERN_4Q8W'
// The probe must itself match one of `patterns` (forbidden-patterns.mjs's
// self-test), so it is built to contain SECRET_PATTERN rather than being an
// unrelated string.
const SECRET_PROBE = `${SECRET_PATTERN}_PROBE_MARKER`
const PRIVATE_PATTERNS_ENV = JSON.stringify({ patterns: [SECRET_PATTERN], probe: SECRET_PROBE })

// Built from parts so this test file's own source text does not itself trip
// forbidden-patterns' windows-profile-path pattern when the repository scans
// its own tracked files.
const FAKE_WINDOWS_PATH = ['C:', 'Users', 'nobody', 'file.txt'].join('\\')

function runCheckPaste(body, extraEnv = {}) {
  const env = {
    ...process.env,
    COMPASS_PASTE_BODY: body,
    COMPASS_PRIVATE_PATTERNS: PRIVATE_PATTERNS_ENV,
    ...extraEnv,
  }
  return spawnSync(process.execPath, [path.join(root, 'scripts', 'check-paste.mjs')], {
    cwd: root,
    encoding: 'utf8',
    env,
  })
}

test('a body containing a forbidden pattern exits 1', () => {
  const result = runCheckPaste(`here is a path: ${FAKE_WINDOWS_PATH}`)
  assert.equal(result.status, 1)
  assert.match(result.stdout, /forbidden-patterns:windows-profile-path/)
})

test('a clean body exits 0', () => {
  const result = runCheckPaste('nothing sensitive in this comment')
  assert.equal(result.status, 0)
})

test('never leaks the matched string or the private pattern value', () => {
  const result = runCheckPaste(`secret: ${SECRET_PATTERN}, path: ${FAKE_WINDOWS_PATH}`)
  assert.equal(result.status, 1)
  for (const stream of [result.stdout, result.stderr]) {
    assert.doesNotMatch(stream, new RegExp(SECRET_PATTERN))
    assert.doesNotMatch(stream, /nobody/)
  }
})

test('check:paste output paths are root-relative, never a drive letter or /home/', () => {
  const result = runCheckPaste(`path: ${FAKE_WINDOWS_PATH}`)
  assert.equal(result.status, 1)
  assert.doesNotMatch(result.stdout, /[A-Za-z]:\\/)
  assert.doesNotMatch(result.stdout, /\/home\//)
})

test('pnpm check output paths are also root-relative, never a drive letter or /home/', () => {
  const result = spawnSync(process.execPath, [path.join(root, 'scripts', 'check.mjs')], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, COMPASS_PRIVATE_PATTERNS: PRIVATE_PATTERNS_ENV },
  })
  assert.doesNotMatch(result.stdout, /[A-Za-z]:\\/)
  assert.doesNotMatch(result.stdout, /\/home\//)
})
