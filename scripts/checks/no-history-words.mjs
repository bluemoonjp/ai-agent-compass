import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { matchesAnyGlob } from '../lib/glob.mjs'

const dataPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'data', 'forbidden-phrases.json')
const { groups } = JSON.parse(readFileSync(dataPath, 'utf8'))

const compiledGroups = groups.map((group) => ({
  id: group.id,
  scope: group.scope,
  patterns: group.patterns.map((p) => new RegExp(p, 'i')),
  excludeIfMatches: (group.excludeIfMatches ?? []).map((p) => new RegExp(p, 'i')),
}))

const FRONTMATTER = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/
const RULE_ID = 'no-history-words'

function bodyOf(text) {
  const match = FRONTMATTER.exec(text)
  return match ? match[2] : text
}

export function run({ files }) {
  const findings = []
  for (const file of files) {
    const lines = bodyOf(file.text).split('\n')
    for (const group of compiledGroups) {
      if (!matchesAnyGlob(file.path, group.scope)) continue
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        if (group.excludeIfMatches.some((p) => p.test(line))) continue
        if (group.patterns.some((p) => p.test(line))) {
          findings.push({ path: file.path, line: i + 1, ruleId: `${RULE_ID}:${group.id}` })
        }
      }
    }
  }
  return { findings }
}
