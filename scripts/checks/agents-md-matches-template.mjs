const RULE_ID = 'agents-md-matches-template'
const H2_PATTERN = /^##\s+(.+?)\s*$/gm

function extractH2s(text) {
  const headings = new Set()
  let m
  H2_PATTERN.lastIndex = 0
  while ((m = H2_PATTERN.exec(text))) headings.add(m[1])
  return headings
}

export function run({ files }) {
  const findings = []

  const root = files.find((f) => f.path === 'AGENTS.md')
  const template = files.find((f) => f.path === 'templates/AGENTS.md.template')
  if (!root || !template) return { findings }

  const rootH2s = extractH2s(root.text)
  const templateH2s = extractH2s(template.text)

  for (const heading of templateH2s) {
    if (!rootH2s.has(heading)) {
      findings.push({ path: template.path, line: 1, ruleId: `${RULE_ID}:not-in-root` })
    }
  }

  return { findings }
}
