import {
  loadChecksRegistry,
  loadCommitMessages,
  loadRepoFiles,
  runCheck,
} from './lib/runner.mjs'

const root = process.cwd()
const fastOnly = process.argv.includes('--fast')

async function main() {
  const checks = loadChecksRegistry(root)
  const files = loadRepoFiles(root)
  const messages = loadCommitMessages(root)

  let blockingFailed = false
  let totalFindings = 0

  for (const check of checks) {
    if (fastOnly && !check.fast) continue
    const { findings } = await runCheck(root, check, { files, messages })
    for (const finding of findings) {
      console.log(`${finding.path}:${finding.line} ${finding.ruleId}`)
    }
    if (findings.length > 0) {
      totalFindings += findings.length
      const suffix = check.blocking ? '' : ' (non-blocking)'
      console.log(`${check.id}: ${findings.length} finding(s)${suffix}`)
      if (check.blocking) blockingFailed = true
    }
  }

  if (totalFindings === 0) {
    console.log('all checks passed')
  }

  process.exit(blockingFailed ? 1 : 0)
}

main()
