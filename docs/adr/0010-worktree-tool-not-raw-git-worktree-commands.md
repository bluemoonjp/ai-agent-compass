# ADR-0010: Use EnterWorktree/ExitWorktree for issue work, deny raw worktree and branch-creation commands

Status: accepted

Issue: #107
Date: 2026-09-21

## Context

This repository's checkout is shared: more than one Claude Code session can point at the same directory at the same time. `permissions.allow` named `git switch -c *`, `git worktree add *`, and `git worktree remove *` outright (ADR-0004's Consequences lists "branch and worktree creation" among the day-to-day operations it names). Any of those, run directly against the shared checkout, changes what every other session working in that same directory sees, mid-task, out from under it — the harm the issue that opened this ADR reported.

Claude Code's own harness already ships a pair of tools built for exactly this: `EnterWorktree` creates an isolated git worktree under `.claude/worktrees/` on a new branch and switches the session into it; `ExitWorktree` leaves it, keeping or removing it. Neither tool fires on its own, though — `EnterWorktree`'s own instructions say to use it "ONLY when explicitly instructed to work in a worktree — either by the user directly, or by project instructions (CLAUDE.md / memory)", and explicitly direct a session that is merely asked to fix a bug or add a feature toward plain git commands instead, with no mention of a worktree. Before this ADR, nothing in this repository's own instructions named a worktree, so that fallback path — plain git commands against whatever directory the session happened to be in — was the one every session actually took.

That also explains a pattern observed in this repository's history: worktrees appearing parallel to the project directory (`../xxx`) rather than nested under it. `EnterWorktree` itself defaults to `.claude/worktrees/<name>`, never a sibling of the project directory, so a sibling worktree is closer to `git worktree add ../xxx -b ...` run ad hoc than to anything `EnterWorktree` produces on its own.

## Decision

Adopt `EnterWorktree`/`ExitWorktree` as this repository's only route into a worktree, and close off the raw alternative from two directions at once:

- Name the convention in `CLAUDE.md` ("Start each issue's work in a worktree via EnterWorktree; end it with ExitWorktree"), which is itself what satisfies `EnterWorktree`'s own trigger condition for every session working in this repository from here on.
- Add `git worktree add *`, `git worktree remove *`, `git switch -c *`/`-C *`, and `git checkout -b *`/`-B *` to `permissions.deny` (all six removed from `permissions.allow` first), and back the same six with this repository's first `PreToolUse` hook, `scripts/hooks/deny-manual-worktree-and-branch-ops.mjs`, which returns a `permissionDecision: "deny"` naming `EnterWorktree`/`ExitWorktree` as the alternative whenever a `Bash`/`PowerShell` command matches one of the same six shapes. The hook is independent of, not a replacement for, the `permissions.deny` entries: per ADR-0004's Decision, the guard stays binary and a hook is not a substitute confirmation step.

`git checkout -b`/`-B` and `git switch -c`/`-C` are covered because they are what the issue that opened this ADR actually named (creating a branch directly in the shared checkout); a plain `git switch <existing-branch>` or `git checkout <existing-branch>` is not, and is addressed below under Known limitations rather than by widening the guard.

## Consequences

Every issue's work now happens in its own worktree under `.claude/worktrees/`, isolated from whatever any other session concurrently checked out in the main directory or another worktree. `ExitWorktree` gives that isolation a defined end: `action: "keep"` while a PR might still need another commit, `action: "remove"` once it has merged or the work is abandoned. `docs/maintain/worktree.md` records the naming convention (`EnterWorktree` with `name: issue-<N>-<slug>` produces the worktree at `.claude/worktrees/issue-<N>-<slug>` on branch `worktree-issue-<N>-<slug>`) and how to remove a worktree neither `ExitWorktree` nor the assistant's own tool calls can touch any more.

ADR-0004's Consequences paragraph, which listed "branch and worktree creation" among the operations `permissions.allow` names for a single issue's pull-request cycle, is updated alongside this ADR to describe the current split instead: creation happens through `EnterWorktree`, and the six raw command shapes that used to do the same job now sit in `permissions.deny`.

Known limitations, recorded rather than solved:

- `git switch <existing-branch>` and `git checkout <existing-branch>` — switching the shared checkout to a branch that already exists, rather than creating one — carry the same blast radius as the six denied shapes, but are not denied. This repository has ordinary uses for switching to an existing branch (restoring files, inspecting another branch briefly) that creating a new one does not share, and `EnterWorktree` is the actual mitigation here: a session that always starts its work with `EnterWorktree` rarely has a reason to switch the shared checkout's branch at all, creation or not. Revisit if a plain switch/checkout in the shared checkout is observed to cause the same harm this ADR addresses.
- Whether `EnterWorktree`'s own internal creation of a worktree is itself subject to the `Bash(git worktree add *)`/`PowerShell(git worktree add *)` deny rules could not be verified before this change merged: a session already running against this branch's own `.claude/settings.json` — edited but uncommitted, inside a worktree of this very repository — kept enforcing the checkout it was launched from, not the worktree's copy, through both a live edit and a full session restart. `EnterWorktree`'s harness-internal creation is very likely unaffected regardless, since branch and worktree operations are guarded per shell tool (`Bash(...)`/`PowerShell(...)`, per ADR-0004's Decision) and this is not one — but that argument is reasoned, not observed. If it turns out to be affected after this change reaches `main`, the fix is editing `.claude/settings.json` again, not a lockout: nothing in this ADR denies `Edit`.
- The same session-launch-pinned settings resolution means this hook's actual firing was never observed before merging, only its schema (validated against the settings schema) and its own script logic (unit-tested in isolation, piping representative stdin payloads directly at it). `permissions.deny` is what is known to enforce these six command shapes; the hook is a second, unverified layer behind it, not a confirmed one.
- `${CLAUDE_PROJECT_DIR}` inside the hook's exec-form `args` is assumed to be substituted the same way the settings schema documents for `${CLAUDE_PLUGIN_ROOT}`. If that assumption is wrong, the hook fails to resolve `node`'s script argument and never fires, while `permissions.deny` still blocks the same six command shapes on its own — so the gap would not be visible as a bypass, only as a hook that silently never contributes its own reason text.
