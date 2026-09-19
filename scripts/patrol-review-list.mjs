import { fileURLToPath } from 'node:url'
import { parse as parseYaml } from 'yaml'
import { loadRepoFiles } from './lib/runner.mjs'

// Lists the ids a model release should prompt a human to re-check: every
// active practice whose applies_to includes claude-code (its rule may
// describe a limitation a new model no longer has), and every antipattern
// still classified undetermined (a new model may resolve the uncertainty
// one way or the other). Prints ids only, one per line, kind-prefixed the
// same way scripts/checks/data/not_applicable.json keys are, so a caller
// can pipe the output straight into another script without parsing prose.

const FRONTMATTER = /^---\n([\s\S]*?)\n---\n?/
const FILENAME_ID = /^(\d{4})-[a-z0-9-]+\.md$/

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
    if (!FILENAME_ID.test(file.path.split('/').pop())) continue
    const data = frontmatterOf(file)
    if (data?.status !== 'active') continue

    if (file.path.startsWith('practices/')) {
      if (Array.isArray(data.applies_to) && data.applies_to.includes('claude-code')) {
        ids.push(`practices/${data.id}`)
      }
    } else if (file.path.startsWith('antipatterns/')) {
      if (data.classification === 'undetermined') {
        ids.push(`antipatterns/${data.id}`)
      }
    }
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
