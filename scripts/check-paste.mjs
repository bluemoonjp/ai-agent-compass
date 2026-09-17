import { readFileSync } from 'node:fs'

import { run } from './checks/forbidden-patterns.mjs'

function readBody() {
  if (process.env.COMPASS_PASTE_BODY !== undefined) return process.env.COMPASS_PASTE_BODY
  return readFileSync(0, 'utf8')
}

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

  process.exit(findings.length > 0 ? 1 : 0)
}

main()
