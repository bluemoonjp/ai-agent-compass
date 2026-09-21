import { readFileSync } from 'node:fs'

const PATTERNS = [
  /\bgit\s+worktree\s+add\b/,
  /\bgit\s+worktree\s+remove\b/,
  /\bgit\s+switch\s+-[cC]\b/,
  /\bgit\s+checkout\s+-[bB]\b/,
]

const REASON =
  "Use EnterWorktree (start) / ExitWorktree (end) instead of a raw git worktree/switch/checkout branch command in this repository's shared checkout -- see CLAUDE.md and docs/maintain/worktree.md."

function readStdin() {
  try {
    return readFileSync(0, 'utf8')
  } catch {
    return ''
  }
}

function main() {
  let input
  try {
    input = JSON.parse(readStdin())
  } catch {
    return
  }

  const command = input?.tool_input?.command
  if (typeof command !== 'string') return
  if (!PATTERNS.some((re) => re.test(command))) return

  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: REASON,
      },
    }),
  )
}

main()
