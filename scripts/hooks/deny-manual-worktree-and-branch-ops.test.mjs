import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { test } from 'node:test'

const root = process.cwd()
const scriptPath = path.join(root, 'scripts', 'hooks', 'deny-manual-worktree-and-branch-ops.mjs')

function runWithInput(input) {
  return spawnSync(process.execPath, [scriptPath], { input, encoding: 'utf8' })
}

function runWithCommand(command, toolName = 'Bash') {
  return runWithInput(JSON.stringify({ tool_name: toolName, tool_input: { command } }))
}

const DENIED_COMMANDS = [
  'git worktree add ../x -b foo',
  'git worktree remove ../x',
  'git switch -c foo',
  'git switch -C foo',
  'git checkout -b foo',
  'git checkout -B foo',
]

for (const command of DENIED_COMMANDS) {
  test(`denies "${command}"`, () => {
    const result = runWithCommand(command)
    const output = JSON.parse(result.stdout)
    assert.equal(output.hookSpecificOutput.hookEventName, 'PreToolUse')
    assert.equal(output.hookSpecificOutput.permissionDecision, 'deny')
    assert.match(output.hookSpecificOutput.permissionDecisionReason, /EnterWorktree/)
  })
}

test('denies a matching command issued through PowerShell too', () => {
  const result = runWithCommand('git worktree add ../x -b foo', 'PowerShell')
  const output = JSON.parse(result.stdout)
  assert.equal(output.hookSpecificOutput.permissionDecision, 'deny')
})

const ALLOWED_COMMANDS = ['git status', 'git switch main', 'git checkout main', 'git worktree list', 'pnpm test']

for (const command of ALLOWED_COMMANDS) {
  test(`stays silent for "${command}"`, () => {
    const result = runWithCommand(command)
    assert.equal(result.stdout, '')
  })
}

test('stays silent on malformed stdin instead of throwing', () => {
  const result = runWithInput('not json')
  assert.equal(result.status, 0)
  assert.equal(result.stdout, '')
})

test('stays silent when tool_input has no command', () => {
  const result = runWithInput(JSON.stringify({ tool_name: 'Bash', tool_input: {} }))
  assert.equal(result.status, 0)
  assert.equal(result.stdout, '')
})
