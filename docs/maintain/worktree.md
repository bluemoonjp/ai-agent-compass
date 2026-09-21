# Worktree discipline

This repository's checkout is shared: more than one Claude Code session can
point at the same directory at the same time. Switching the branch checked
out in a shared directory (`git switch -c`, `git checkout -b`, or creating
or removing a worktree with the raw `git worktree` subcommand) changes what
every other session in that directory sees, mid-task, out from under it.

## Use EnterWorktree / ExitWorktree, not raw git commands

Start each issue's work with the `EnterWorktree` tool and end it with
`ExitWorktree` (`CLAUDE.md` names this so the tools' own trigger condition —
project instructions naming a worktree — is satisfied). Do not run
`git worktree add`, `git worktree remove`, `git switch -c`/`-C`, or
`git checkout -b`/`-B` directly: `.claude/settings.json` denies all of them,
backed by a `PreToolUse` hook
(`scripts/hooks/deny-manual-worktree-and-branch-ops.mjs`) that returns the
same guidance. See ADR-0010 for why both layers exist.

`EnterWorktree` with a `name` creates the worktree under
`.claude/worktrees/<name>` on a new branch named `worktree-<name>` (verified
empirically: `name: issue-111-gh-read-permissions` produced the worktree at
`.claude/worktrees/issue-111-gh-read-permissions` on branch
`worktree-issue-111-gh-read-permissions`). Name it after the issue, for
example `issue-<N>-<slug>`.

The base ref for a new worktree follows the `worktree.baseRef` setting,
which this repository leaves unset — so `EnterWorktree` uses the default,
`fresh`: it branches from `origin/<default-branch>`, not from whatever the
shared checkout's `HEAD` happens to be. Setting it to `head` would branch
from the session's current local `HEAD` instead; this repository has no
reason to do that, since every issue's work starts from `main`.

When the work is done, call `ExitWorktree` with `action: "keep"` to leave
the worktree and its branch on disk (for example, while a PR is still open
and might need another commit) or `action: "remove"` for a clean exit once
the PR has merged or the work is abandoned.

## Cleaning up a worktree the tools won't touch

`ExitWorktree` only acts on a worktree that this same session created with
`EnterWorktree`. A worktree left behind by a different, already-ended
session — for example after its PR merged and nobody removed it — is
outside that scope, and `git worktree remove` is now denied for the
assistant. Remove it as the human, outside the assistant's tool-call
permission gate: run `git worktree remove .claude/worktrees/<name>` (and,
if its branch still exists, `git branch -D worktree-<name>`) yourself, for
example via the `!` prefix in the prompt, rather than asking the assistant
to run it.
