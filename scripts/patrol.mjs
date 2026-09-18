import { fileURLToPath } from 'node:url'

import { probeUrl } from './patrol/probe.mjs'

async function runProbe(urls) {
  let exitCode = 0
  for (const url of urls) {
    try {
      const result = await probeUrl(url)
      const suffix = result.patterns.length > 0 ? ` patterns=${result.patterns.join(',')}` : ''
      console.log(`${url} volatile=${result.volatile} recommendedMethod=${result.recommendedMethod}${suffix}`)
    } catch {
      console.log(`${url} volatile=unknown recommendedMethod=none`)
      exitCode = 1
    }
  }
  return exitCode
}

async function main() {
  const args = process.argv.slice(2)
  const probeIndex = args.indexOf('--probe')

  if (probeIndex !== -1) {
    const urls = args.slice(probeIndex + 1)
    if (urls.length === 0) {
      console.error('usage: patrol.mjs --probe <url> [<url> ...]')
      process.exit(1)
    }
    process.exit(await runProbe(urls))
  }

  console.error('usage: patrol.mjs --probe <url> [<url> ...]')
  process.exit(1)
}

if (process.argv[1] && process.argv[1] === fileURLToPath(import.meta.url)) {
  main()
}
