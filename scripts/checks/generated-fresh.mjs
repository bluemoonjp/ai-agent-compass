import { applyBlock, renderAuthoringTable } from '../gen.mjs'

const RULE_ID = 'generated-fresh'
const CHECKS_PATH = 'checks.json'
const AUTHORING_PATH = 'docs/maintain/authoring.md'

function normalize(text) {
  return text.replace(/\r\n/g, '\n')
}

function markerLine(text) {
  const idx = text.indexOf('<!-- gen:start -->')
  if (idx === -1) return 1
  return text.slice(0, idx).split('\n').length
}

export function run({ files }) {
  const checksFile = files.find((f) => f.path === CHECKS_PATH)
  const authoringFile = files.find((f) => f.path === AUTHORING_PATH)
  if (!checksFile || !authoringFile) return { findings: [] }

  const checks = JSON.parse(checksFile.text).checks
  const table = renderAuthoringTable(checks)
  const actual = normalize(authoringFile.text)
  const expected = normalize(applyBlock(actual, table))

  if (actual === expected) return { findings: [] }

  return {
    findings: [
      { path: AUTHORING_PATH, line: markerLine(actual), ruleId: `${RULE_ID}:stale` },
    ],
    notices: [`${RULE_ID}: ${AUTHORING_PATH} is stale — run: pnpm gen`],
  }
}
