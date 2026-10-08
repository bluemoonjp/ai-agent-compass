import { fileURLToPath } from 'node:url'
import { parse as parseYaml } from 'yaml'
import { loadRepoFiles } from './lib/runner.mjs'

// Lists the ids a model release should prompt a human to re-check: every
// active practice and every active antipattern. It deliberately does not
// narrow by frontmatter. Frontmatter records which tool a file applies to
// and what kind each source is, but not whether the claim depends on how a
// model behaves, so any narrowing condition both misses model-dependent
// claims and includes ones that are not. Adapters are out of scope: they
// describe other tools' mechanisms, which the weekly patrol covers. Prints
// ids only, one per line, kind-prefixed the same way
// scripts/checks/data/not_applicable.json keys are, so a caller can pipe the
// output straight into another script without parsing prose.

const FRONTMATTER = /^---\n([\s\S]*?)\n---\n?/
const FILENAME_ID = /^(\d{4})-[a-z0-9-]+\.md$/
const KIND_DIRS = ['practices', 'antipatterns']

function frontmatterOf(file) {
  const match = FRONTMATTER.exec(file.text)
  if (!match) return null
  try {
    return parseYaml(match[1])
  } catch {
    return null
  }
}

export function reviewListIds({ files }) {
  const ids = []
  for (const file of files) {
    const dir = KIND_DIRS.find((d) => file.path.startsWith(`${d}/`))
    if (!dir) continue
    if (!FILENAME_ID.test(file.path.split('/').pop())) continue
    const data = frontmatterOf(file)
    if (data?.status !== 'active') continue
    ids.push(`${dir}/${data.id}`)
  }
  return ids.sort()
}

function main() {
  const root = process.cwd()
  const files = loadRepoFiles(root)
  for (const id of reviewListIds({ files })) {
    console.log(id)
  }
}

if (process.argv[1] && process.argv[1] === fileURLToPath(import.meta.url)) {
  main()
}
