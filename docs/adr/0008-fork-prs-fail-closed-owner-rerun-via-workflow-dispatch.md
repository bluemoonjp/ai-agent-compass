# ADR-0008: External contributions open; a fork PR's private-pattern stage stays fail-closed until an owner reruns it via workflow_dispatch

Status: accepted

Issue: #46
Date: 2026-09-19

## Context

`CONTRIBUTING.md` has said this repository is not yet accepting outside
contributions. Opening it up means most pull requests that matter will come
from a fork rather than a branch of this repository.

GitHub Actions never sends repository secrets to a run triggered by
`pull_request` when the pull request's head is a fork — this applies to
every activity type (`opened`, `synchronize`, `labeled`, ...), not only the
initial one. `ci.yml`'s `check` job passes `COMPASS_PRIVATE_PATTERNS` as
such a secret, and ADR-0002 already made "the variable is unset" a
fail-closed condition rather than a silent skip, specifically so a
misconfiguration cannot look like a clean pass. `docs/maintain/setup.md`
already documented the resulting effect — every fork PR's `check` job (and
`public-surface.yml`'s `check-paste` step) fails on
`forbidden-patterns:env-unset` — as a known limitation left for this
repository's fork-contribution path to decide. This is that decision.

The one trigger that does hand a fork PR's workflow run the repository's
secrets is `pull_request_target`: it runs in the base repository's context
regardless of where the head branch lives. It is also the trigger most
commonly implicated in secret-exfiltration incidents, because a workflow
using it typically checks out and evaluates the fork's own commit while
still holding the base repository's secrets and a more privileged
`GITHUB_TOKEN` — and it does this automatically, on every push to the fork
branch, with no human step in between. This repository does not use it.

## Decision

- No workflow in this repository uses `pull_request_target`.
- `ci.yml`'s `check` job keeps its current behavior unchanged: a fork PR's
  `pnpm check` fails closed on `forbidden-patterns:env-unset`, exactly as
  ADR-0002 already specifies. This is now the intended state for a fork
  PR — "owner review needed" — not a bug to route around.
- `.github/workflows/fork-recheck.yml`, triggered only by `workflow_dispatch`
  with two required inputs (`pr_number`, `head_sha`), lets an owner rerun
  the full `pnpm check` (secret present) against the exact commit they have
  reviewed. The job checks out `refs/pull/<pr_number>/head`, then refuses to
  continue if that ref's current commit no longer matches `head_sha` — so a
  commit pushed after the owner starts the dispatch cannot be substituted
  for the one they reviewed. It posts one comment on the PR recording the
  checked SHA and whether `pnpm check` passed, which is the durable record
  that this path ran.
- A label-triggered rerun (the other option the issue named) was rejected:
  since a `pull_request` event never carries secrets for a fork head
  regardless of activity type, a label-based trigger could only reach
  `COMPASS_PRIVATE_PATTERNS` through `pull_request_target`, which the
  previous point rules out. `workflow_dispatch` is the only one of the two
  named options this repository can implement without it.
- `public-surface.yml`'s `check-paste` step loses the same secret on a fork
  PR and fails the same way, but until now that failure produced the
  `needs-redaction` label and a comment claiming a private-info-shaped
  string was found — which is false when the real cause is the missing
  secret rather than a match. The "Flag needs-redaction" step is now
  skipped for a fork PR; a separate "Flag needs-owner-recheck" step reacts
  to the same failure there instead, with a `needs-owner-recheck` label and
  a comment that states the actual reason. This changes only the
  workflow's reaction to `check-paste`'s exit code — `forbidden-patterns.mjs`
  keeps the single fail-closed behavior ADR-0002 gave it, unweakened,
  everywhere else it runs.
- Issue Forms become mandatory: `.github/ISSUE_TEMPLATE/config.yml` sets
  `blank_issues_enabled: false`, backed by a "Bug report" and a "Content
  problem" form.
- `.github/CODEOWNERS` names the maintainer as owner of the whole tree. This
  only has an effect once branch protection is configured to require code
  owner review — a repository setting, not a file in this repository — and
  only for a PR opened by someone other than the maintainer; ADR-0001
  already recorded that a single-maintainer repository has no equivalent
  gate for the maintainer's own PRs, and that has not changed.
- `CONTRIBUTING.md` describes this from a contributor's side: what this
  repository accepts, the fork-PR flow above, and that a contribution is
  made under whichever of MIT or CC BY 4.0 covers the path it touches
  (inbound = outbound), matching `README.md`'s existing license split.

## Consequences

A first-time fork PR will predictably show a failing `check` job on the
private-pattern stage; that is the maintainer's cue to review the diff and
run `fork-recheck.yml`, not something a contributor needs to fix.

`fork-recheck.yml` still checks out the reviewed commit's own `scripts/`,
`package.json`, and `pnpm-lock.yaml`, and runs `pnpm install` and
`pnpm check` from that commit with the secret present in the job
environment — the same execution shape a `pull_request_target` workflow
would produce; only the trigger and the human step before it differ. The
manual review of that one commit, done before the owner dispatches the
rerun, is the only control against a malicious payload hidden in it; this
workflow does not sandbox that risk away, and this ADR records that as a
deliberate trade-off rather than a solved problem.

`public-surface.yml` now carries two branches of reaction to the same
`check-paste` failure instead of one, and each must keep stating the
correct reason (an actual match, or a fork PR's missing secret) as the
workflow evolves.
