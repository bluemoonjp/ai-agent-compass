import { parse as parseYaml } from 'yaml'

const RULE_ID = 'template-ids-resolve'
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

export function run({ files }) {
  const findings = []

  const activeIds = new Set()
  for (const file of files) {
    if (!file.path.startsWith('practices/') || !file.path.endsWith('.md')) continue
    const data = extractFrontmatter(file.text)
    if (data?.status === 'active' && typeof data.id === 'string') activeIds.add(data.id)
  }

  const sidecars = files.filter((f) => f.path.startsWith('templates/') && f.path.endsWith('.template.json'))
  for (const sidecar of sidecars) {
    let data
    try {
      data = JSON.parse(sidecar.text)
    } catch {
      findings.push({ path: sidecar.path, line: 1, ruleId: `${RULE_ID}:invalid-json` })
      continue
    }
    for (const ids of Object.values(data)) {
      if (!Array.isArray(ids)) continue
      for (const id of ids) {
        if (typeof id !== 'string' || !activeIds.has(id)) {
          findings.push({ path: sidecar.path, line: 1, ruleId: `${RULE_ID}:unresolved` })
        }
      }
    }
  }

  return { findings }
}
