import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const AUTHORING_PATH = 'docs/maintain/authoring.md'
const TABLE_HEADER = '| Check | Blocking | Enforces | What it protects |'
const TABLE_SEP = '| --- | --- | --- | --- |'
const START_MARKER = '<!-- gen:start -->'
const END_MARKER = '<!-- gen:end -->'

export function renderAuthoringTable(checks) {
  const rows = checks.map((c) => {
    const blocking = c.blocking ? 'yes' : 'no'
    const enforces = (c.enforces ?? []).join(', ')
    return `| \`${c.id}\` | ${blocking} | ${enforces} | ${c.protects} |`
  })
  return [TABLE_HEADER, TABLE_SEP, ...rows].join('\n')
}

export function applyBlock(text, block) {
  const startIdx = text.indexOf(START_MARKER)
  const endIdx = text.indexOf(END_MARKER)
  if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
    throw new Error(`applyBlock: could not find ${START_MARKER}/${END_MARKER} markers`)
  }
  const before = text.slice(0, startIdx + START_MARKER.length)
  const after = text.slice(endIdx)
  return `${before}\n${block}\n${after}`
}

function main() {
  const root = process.cwd()
  const checks = JSON.parse(readFileSync(path.join(root, 'checks.json'), 'utf8')).checks
  const table = renderAuthoringTable(checks)
  const authoringAbs = path.join(root, AUTHORING_PATH)
  const current = readFileSync(authoringAbs, 'utf8')
  const next = applyBlock(current, table).replace(/\r\n/g, '\n')
  writeFileSync(authoringAbs, next)
}

if (process.argv[1] && process.argv[1] === fileURLToPath(import.meta.url)) {
  main()
}
