# Fork PR

This page is the maintainer's own procedure for taking a fork PR from a
completed review through to a merged commit on `main`. It does not explain
why this shape exists — see ADR-0008 for why the private-pattern stage stays
fail-closed on a fork PR, and ADR-0011 for why a reviewed fork PR lands as a
separate, re-landed pull request rather than merging in place. The
contributor-facing view of the same flow is in `CONTRIBUTING.md`.

## 1. Review the diff first

Read the whole diff, including `.github/` and `scripts/`, before doing
anything else. Step 2 below runs that commit's own code — its own
`package.json`, `pnpm-lock.yaml`, `scripts/`, and any local composite
action — with the private-pattern secret present in the job environment.
The review here is the only control against a malicious payload in that
commit; nothing in step 2 sandboxes that risk away.

## 2. Rerun the recheck against the reviewed commit

There is no prior example of this dispatch anywhere in this repository.

```bash
gh workflow run fork-recheck.yml -f pr_number=<N> -f head_sha=<full-sha>
gh run list --workflow fork-recheck.yml -L 1
gh run view <run-id> --log
```

Use the exact commit you just reviewed as `head_sha`. If the PR's head has
moved since — another commit was pushed — the workflow's own guard step
refuses to continue rather than rechecking a commit you never reviewed;
re-review the new head and dispatch again with its SHA. The comment the
workflow posts on the PR is the durable record that this run happened; when
reading the log, also confirm `commits checked:` is not zero — a base
commit the checkout could not reach would make the commit-message scan
silently pass over nothing, which looks the same as a clean pass otherwise.

## 3. Land the reviewed commits

Per ADR-0011: start an `EnterWorktree` session, cherry-pick the reviewed
commits onto a fresh branch of this repository with the contributor's
authorship preserved, open a `#N: summary` pull request from it, get it
through this repository's ordinary CI and review, merge it, then close the
original fork PR with a comment linking to where the work landed.

Two things to watch operationally:

- The cherry-pick carries the contributor's own trailers into the landing
  PR's `BASE..HEAD` commit range. Before pushing, set `COMPASS_BASE_SHA` and
  `COMPASS_HEAD_SHA` and run `pnpm check` locally; fix anything it flags in
  a commit message with `--amend` rather than a new commit.
- Any trailer address the cherry-pick brings in must already be covered by
  `scripts/checks/data/trailer-allowlist.json`, or the landing PR's own
  `check` job fails on it.

## Rehearsal record

Dispatched 2026-09-21 against pull request #116, `head_sha`
`5c1ee95d1c0890941172757211d29877798245bf`.

- `fork-recheck.yml` run 35618603711 completed with conclusion `success`.
  Its "Confirm the PR head has not moved since review" step ran and passed
  (the guard was not skipped or bypassed).
- The `pnpm check` step's env showed `COMPASS_PRIVATE_PATTERNS: ***`
  (masked, confirming the secret was present, not withheld) and the run's
  own log showed `commits checked: 4` (not zero) and `all checks passed`.
- The workflow posted its comment on the PR — the durable record ADR-0008
  refers to — at
  <https://github.com/bluemoonjp/ai-agent-compass/pull/116#issuecomment-5762967996>.

What this rehearsal did not cover: PR #116's head is a branch of this
repository, not an actual fork, so GitHub did not withhold
`COMPASS_PRIVATE_PATTERNS` from `ci.yml`'s own `check` job the way it would
for a genuine fork PR — that job's fail-closed behavior was not exercised by
this run. Half of that gap is covered separately, by the
`scripts/checks/forbidden-patterns.test.mjs` test
`CI + unset COMPASS_PRIVATE_PATTERNS fails closed`, unit-testing the same
code path this rehearsal could not reach through a real workflow run.

Replace this record the first time a PR with an actual fork head goes
through this page's procedure: rerun steps 1–3 above against that PR and
overwrite the entries here with what that run actually shows.
