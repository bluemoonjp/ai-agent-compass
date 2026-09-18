import {
  applyBlock,
  parsePracticeRows,
  renderAuthoringTable,
  renderPracticeIndex,
  renderReadmeBlockEn,
  renderReadmeBlockJa,
} from '../gen.mjs'

const RULE_ID = 'generated-fresh'
const CHECKS_PATH = 'checks.json'
const AUTHORING_PATH = 'docs/maintain/authoring.md'
const PRACTICE_INDEX_PATH = 'practices/index.md'
const README_PATH = 'README.md'

function normalize(text) {
  return text.replace(/\r\n/g, '\n')
}

function markerLine(text, marker) {
  const idx = text.indexOf(marker)
  if (idx === -1) return 1
  return text.slice(0, idx).split('\n').length
}

export function run({ files }) {
  const findings = []
  const notices = []

  const checksFile = files.find((f) => f.path === CHECKS_PATH)
  const authoringFile = files.find((f) => f.path === AUTHORING_PATH)
  if (checksFile && authoringFile) {
    const checks = JSON.parse(checksFile.text).checks
    const table = renderAuthoringTable(checks)
    const actual = normalize(authoringFile.text)
    const expected = normalize(applyBlock(actual, table))
    if (actual !== expected) {
      findings.push({ path: AUTHORING_PATH, line: markerLine(actual, '<!-- gen:start -->'), ruleId: `${RULE_ID}:stale` })
      notices.push(`${RULE_ID}: ${AUTHORING_PATH} is stale — run: pnpm gen`)
    }
  }

  const rows = parsePracticeRows(files)

  const indexFile = files.find((f) => f.path === PRACTICE_INDEX_PATH)
  if (indexFile) {
    const actual = normalize(indexFile.text)
    const expected = normalize(renderPracticeIndex(rows))
    if (actual !== expected) {
      findings.push({ path: PRACTICE_INDEX_PATH, line: 1, ruleId: `${RULE_ID}:index-stale` })
      notices.push(`${RULE_ID}: ${PRACTICE_INDEX_PATH} is stale — run: pnpm gen`)
    }
  }

  const readmeFile = files.find((f) => f.path === README_PATH)
  if (readmeFile) {
    const actual = normalize(readmeFile.text)
    const withEn = applyBlock(actual, renderReadmeBlockEn(rows), 'how-to-use-en')
    const expected = normalize(applyBlock(withEn, renderReadmeBlockJa(rows), 'how-to-use-ja'))
    if (actual !== expected) {
      findings.push({
        path: README_PATH,
        line: markerLine(actual, '<!-- gen:start:how-to-use-en -->'),
        ruleId: `${RULE_ID}:readme-stale`,
      })
      notices.push(`${RULE_ID}: ${README_PATH} is stale — run: pnpm gen`)
    }
  }

  return notices.length > 0 ? { findings, notices } : { findings }
}
