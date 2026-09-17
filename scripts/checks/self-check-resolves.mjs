import { readFileSync } from 'node:fs'
import path from 'node:path'
import { parse as parseYaml } from 'yaml'

const RULE_ID = 'self-check-resolves'
const FRONTMATTER = /^---\n([\s\S]*?)\n---\n?/

function extractFrontmatter(text) {
  const match = FRONTMATTER.exec(text)
  if (!match) return null
  try {
    return parseYaml(match[1])
  } catch {
    return null
  }
}

function readJson(root, relPath, fallback) {
  try {
    return JSON.parse(readFileSync(path.join(root, relPath), 'utf8'))
  } catch {
    return fallback
  }
}

export function run({ root, files }) {
  const findings = []

  const checks = readJson(root, 'checks.json', { checks: [] }).checks ?? []
  const enforcedIds = new Set(checks.flatMap((c) => c.enforces ?? []))

  const notApplicable = readJson(root, 'scripts/checks/data/not_applicable.json', {})
  const notApplicableIds = new Set(Object.keys(notApplicable))

  const practiceFiles = files.filter((f) => f.path.startsWith('practices/') && f.path.endsWith('.md'))
  for (const file of practiceFiles) {
    const data = extractFrontmatter(file.text)
    if (!data || data.status !== 'active' || typeof data.id !== 'string') continue
    if (!enforcedIds.has(data.id) && !notApplicableIds.has(data.id)) {
      findings.push({ path: file.path, line: 1, ruleId: `${RULE_ID}:unresolved` })
    }
  }

  return { findings }
}
