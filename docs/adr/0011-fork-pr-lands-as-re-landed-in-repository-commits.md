# ADR-0011: A reviewed fork PR lands as re-landed commits on a repository branch, not as its own merge

Status: accepted

Issue: #46
Date: 2026-09-21

## Context

Branch protection on the default branch requires the `check` context and sets
`enforce_admins: true` (confirmed 2026-09-21 via the repository's branch
protection settings). ADR-0008 made `check` fail closed on every fork PR by
design: `forbidden-patterns:env-unset` on the private-pattern stage, because
GitHub Actions withholds repository secrets from a `pull_request` run whose
head is a fork. `fork-recheck.yml` gives an owner a way to run the same
`pnpm check` with the secret present, against a commit they have reviewed,
but it only posts a comment recording the outcome — it never writes a commit
status.

Neither ADR-0008 nor `CONTRIBUTING.md` worked out what happens after that
comment lands. `check` never turns green on the fork PR itself, no matter
what `fork-recheck.yml` reports, because nothing in this repository writes
that context for a fork PR's own commit. `enforce_admins` closes the
remaining route: an owner cannot override the required-context gate to merge
around it, either. The result is that a reviewed, passing fork PR had no
path to `main` at all — the fork-contribution flow ADR-0008 opened up stopped
short of actually landing anything.

## Decision

- A reviewed fork PR's commits are cherry-picked, preserving authorship, onto
  a branch of this repository; that branch becomes its own pull request,
  goes through this repository's ordinary CI and review, and is merged
  normally. The original fork PR is then closed with a comment pointing at
  the landing PR.
- `fork-recheck.yml` is not granted `statuses: write`, and does not write a
  commit status. The `check` context continues to come only from `ci.yml`'s
  own run, on the landing PR's own commits.
- `fork-recheck.yml`'s comment records the private-pattern stage's verdict
  on the exact fork commit an owner reviewed. It is a precondition for
  starting the re-landing above, not a substitute for the landing PR's own
  CI.
- `enforce_admins` is not toggled per PR; it stays on at all times.

### Rejected alternatives

- **Have `fork-recheck.yml` write the `check` commit status itself.** That
  job already runs the reviewed fork commit's own `package.json`,
  `pnpm-lock.yaml`, `scripts/`, and composite action, with the private-
  pattern secret present. Letting the same run also flip this repository's
  own merge gate to green hands a secret-bearing, fork-authored execution
  the authority to pass itself. It would also turn an actually-failing
  required check green by another path than the one that produced the
  failure — the exact inversion ADR-0002's fail-closed design exists to
  prevent. `fork-recheck.yml` does not even run `pnpm test`, so the context
  it would be writing is weaker than what `ci.yml`'s `check` job already
  promises.
- **Temporarily disable `enforce_admins`, merge with `gh pr merge --admin`,
  re-enable it.** Forgetting the re-enable step is a silent, persistent
  failure with no trace left in the repository once it happens — nothing
  records that the gate was ever off.
- **Split `check` into a secret-free required context and a second context
  `fork-recheck.yml` fills for the private-pattern stage.** This needs
  `pnpm check` to support skipping the private-pattern stage under a flag,
  which is exactly the silent-skip shape ADR-0002 already ruled out for
  this check.

## Consequences

Landing a fork PR now takes a maintainer's manual cherry-pick and a second
pull request, in proportion to how many fork PRs this repository receives.
The condition for revisiting this decision is that volume rising enough to
justify the effort of automating it — and revisiting it means answering the
two objections raised against having `fork-recheck.yml` write its own
`check` status, not just citing convenience.

A contributor's fork PR ends up shown as "closed", never "merged", even when
its content is accepted and landed. `CONTRIBUTING.md` states this ahead of
time so a contributor does not read a closed PR as a rejection.

Preserving authorship through the cherry-pick can add a `Co-authored-by:` or
`Signed-off-by:` trailer naming the contributor's own commit address to the
landing PR's range; the trailer allowlist in
`scripts/checks/data/trailer-allowlist.json` has to already cover that
address, or the landing PR's own `check` job fails on it.
