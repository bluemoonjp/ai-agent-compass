# Contributing

## What this repository accepts

- A correction, a source update, or a new practice, antipattern, adapter,
  or template under `practices/`, `antipatterns/`, `adapters/`, or
  `templates/`, backed by a link to a primary source.
- A fix to a check, script, or workflow under `scripts/` or
  `.github/workflows/`.
- A documentation fix to `README.md`, `docs/adr/`, or `docs/maintain/`.

Open an issue first for anything larger than a small fix, using one of the
Issue Forms under "New issue", so the approach is agreed before you spend
time on a pull request. `AGENTS.md` and `docs/maintain/authoring.md`
describe this repository's conventions and check suite.

## Opening a pull request

- PR titles match `#N: summary`, where `N` is the issue the PR addresses.
- Run `pnpm check` and `pnpm test` locally before opening the PR; both must
  pass.
- `.github/CODEOWNERS` names the maintainer as owner of the whole tree; a
  pull request needs their review before it can merge.

## Pull requests from a fork

A pull request opened from a fork does not receive this repository's
`COMPASS_PRIVATE_PATTERNS` secret — GitHub Actions never sends repository
secrets to a `pull_request`-triggered run when the head is a fork. Because
of that, CI's `check` job fails on the private-pattern stage
(`forbidden-patterns:env-unset`) for every fork PR, regardless of the PR's
actual content — this is expected, not something to fix in your PR. The
rest of `pnpm check`, and `pnpm test`, still run and still need to pass.

After reviewing the diff, the maintainer clears that failure by manually
running the "Fork PR recheck" workflow (`workflow_dispatch`, from the
Actions tab) against the PR's exact head commit; it posts a comment on the
PR recording the outcome. There is no action for you to take here beyond
waiting for that review. See ADR-0008 for why this path exists and why it
does not use `pull_request_target`.

## License

Code, scripts, schemas, templates, skills, and configuration are licensed
under [MIT](LICENSE); documentation (practices, antipatterns, adapters,
docs, and this repository's other prose) is licensed under
[CC BY 4.0](LICENSE-DOCS) — see `README.md`'s "License" section for the
exact split. By opening a pull request, you agree to license your
contribution under whichever of those licenses covers the path(s) it
changes.
