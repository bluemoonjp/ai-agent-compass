import { readFileSync } from 'node:fs'

import { run } from './checks/forbidden-patterns.mjs'

function readBody() {
  if (process.env.COMPASS_PASTE_BODY !== undefined) return process.env.COMPASS_PASTE_BODY
  return readFileSync(0, 'utf8')
}

// configError() (forbidden-patterns.mjs) always emits this fixed path for a
// finding that means "the check itself could not run" (unset/invalid
// COMPASS_PRIVATE_PATTERNS, probe mismatch) rather than "matched text was
// found". Any other path is a real match against scanned content.
const CONFIG_ERROR_PATH = '(private-patterns)'

function main() {
  const text = readBody()
  const { findings, notices } = run({
    files: [{ path: '(stdin)', text }],
    messages: [],
    strict: true,
  })

  for (const notice of notices) {
    console.log(notice)
  }
  for (const finding of findings) {
    console.log(`${finding.path}:${finding.line} ${finding.ruleId}`)
  }

  if (findings.length === 0) process.exit(0)
  const hasContentMatch = findings.some((finding) => finding.path !== CONFIG_ERROR_PATH)
  // Exit 1: at least one real match was found (redaction needed), even if a
  // config error (for example a fork PR's unset secret) also fired
  // alongside it. Exit 2: every finding is a config error and none is a
  // real match — the check could not run, nothing was found. A caller that
  // only checks "did it exit non-zero" still fails closed either way; a
  // caller that needs to tell the two apart (public-surface.yml) reads the
  // code.
  process.exit(hasContentMatch ? 1 : 2)
}

main()
