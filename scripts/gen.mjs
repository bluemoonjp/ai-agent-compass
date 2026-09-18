import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse as parseYaml } from 'yaml'

const AUTHORING_PATH = 'docs/maintain/authoring.md'
const PRACTICES_DIR = 'practices'
const PRACTICE_INDEX_PATH = 'practices/index.md'
const README_PATH = 'README.md'
const TABLE_HEADER = '| Check | Blocking | Enforces | What it protects |'
const TABLE_SEP = '| --- | --- | --- | --- |'
const START_MARKER = '<!-- gen:start -->'
const END_MARKER = '<!-- gen:end -->'
const FRONTMATTER = /^---\n([\s\S]*?)\n---\n?/
const PRACTICE_FILENAME = /^(\d{4})-[a-z0-9-]+\.md$/

export function renderAuthoringTable(checks) {
  const rows = checks.map((c) => {
    const blocking = c.blocking ? 'yes' : 'no'
    const enforces = (c.enforces ?? []).join(', ')
    return `| \`${c.id}\` | ${blocking} | ${enforces} | ${c.protects} |`
  })
  return [TABLE_HEADER, TABLE_SEP, ...rows].join('\n')
}

export function applyBlock(text, block, id = null) {
  const startMarker = id ? `<!-- gen:start:${id} -->` : START_MARKER
  const endMarker = id ? `<!-- gen:end:${id} -->` : END_MARKER
  const startIdx = text.indexOf(startMarker)
  const endIdx = text.indexOf(endMarker)
  if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
    throw new Error(`applyBlock: could not find ${startMarker}/${endMarker} markers`)
  }
  const before = text.slice(0, startIdx + startMarker.length)
  const after = text.slice(endIdx)
  return `${before}\n${block}\n${after}`
}

// Pure: takes files ({path, text}[]) instead of reading disk, so a fixture
// test can exercise it with a temporary file set (see generated-fresh.mjs).
export function parsePracticeRows(files) {
  const rows = []
  for (const file of files) {
    if (!file.path.startsWith(`${PRACTICES_DIR}/`)) continue
    if (!PRACTICE_FILENAME.test(path.basename(file.path))) continue
    const match = FRONTMATTER.exec(file.text)
    if (!match) continue
    let data
    try {
      data = parseYaml(match[1])
    } catch {
      continue
    }
    if (data?.status !== 'active') continue
    const verifiedOn = (data.sources ?? [])
      .map((s) => s?.verified_on)
      .filter((v) => typeof v === 'string')
      .sort()[0]
    rows.push({
      id: data.id,
      rule: data.rule,
      topic: data.topic,
      appliesTo: (data.applies_to ?? []).join(', '),
      verifiedOn: verifiedOn ?? '',
    })
  }
  rows.sort((a, b) => a.id.localeCompare(b.id))
  return rows
}

export function renderPracticeIndex(rows) {
  const header = ['# Practice index', '', 'Generated from `practices/*.md` by `pnpm gen`; do not edit.', '']
  const table = [
    '| ID | Rule | Topic | Applies to | Verified on |',
    '| --- | --- | --- | --- | --- |',
    ...rows.map((r) => `| ${r.id} | ${r.rule} | ${r.topic} | ${r.appliesTo} | ${r.verifiedOn} |`),
  ]
  const footer = ['', "This table's content is drawn from `practices/`, licensed under [CC BY 4.0](../LICENSE-DOCS)."]
  return [...header, ...table, ...footer, ''].join('\n')
}

export function renderReadmeBlockEn(rows) {
  return `_Generated from \`practices/*.md\` by \`pnpm gen\`; do not edit this block._ **${rows.length}** active practices are indexed in [\`practices/index.md\`](practices/index.md), licensed under [CC BY 4.0](LICENSE-DOCS).`
}

export function renderReadmeBlockJa(rows) {
  return `_\`practices/*.md\` から \`pnpm gen\` で生成。このブロックは編集しないこと。_ **${rows.length}** 件の active な practice を [\`practices/index.md\`](practices/index.md) に索引化(ライセンス: [CC BY 4.0](LICENSE-DOCS))。`
}

function listPracticeFiles(root) {
  const dir = path.join(root, PRACTICES_DIR)
  const files = []
  for (const name of readdirSync(dir)) {
    if (!PRACTICE_FILENAME.test(name)) continue
    files.push({ path: `${PRACTICES_DIR}/${name}`, text: readFileSync(path.join(dir, name), 'utf8') })
  }
  return files
}

function main() {
  const root = process.cwd()
  const checks = JSON.parse(readFileSync(path.join(root, 'checks.json'), 'utf8')).checks
  const table = renderAuthoringTable(checks)
  const authoringAbs = path.join(root, AUTHORING_PATH)
  const currentAuthoring = readFileSync(authoringAbs, 'utf8')
  const nextAuthoring = applyBlock(currentAuthoring, table).replace(/\r\n/g, '\n')
  writeFileSync(authoringAbs, nextAuthoring)

  const rows = parsePracticeRows(listPracticeFiles(root))

  const indexAbs = path.join(root, PRACTICE_INDEX_PATH)
  writeFileSync(indexAbs, renderPracticeIndex(rows).replace(/\r\n/g, '\n'))

  const readmeAbs = path.join(root, README_PATH)
  const currentReadme = readFileSync(readmeAbs, 'utf8')
  const withEn = applyBlock(currentReadme, renderReadmeBlockEn(rows), 'how-to-use-en')
  const nextReadme = applyBlock(withEn, renderReadmeBlockJa(rows), 'how-to-use-ja').replace(/\r\n/g, '\n')
  writeFileSync(readmeAbs, nextReadme)
}

if (process.argv[1] && process.argv[1] === fileURLToPath(import.meta.url)) {
  main()
}
