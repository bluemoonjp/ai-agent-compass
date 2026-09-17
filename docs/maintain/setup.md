# Maintainer setup

## Private patterns (`COMPASS_PRIVATE_PATTERNS`)

The `forbidden-patterns` check also scans for maintainer-private strings (a
real name, a home directory, an internal hostname, ...) that the generic
patterns in `scripts/checks/data/forbidden-patterns.json` cannot know about.
Those strings never live in this repository; they live only in an
environment variable, `COMPASS_PRIVATE_PATTERNS`, set locally by each
maintainer and, in CI, as a GitHub Actions secret.

The value is a JSON object with two fields:

- `patterns`: an array of regular-expression source strings to search for
- `probe`: a string that must match at least one of `patterns` — this is a
  self-test so a typo that makes every pattern inert fails closed instead of
  silently scanning nothing

### Set it locally

PowerShell:

```powershell
$env:COMPASS_PRIVATE_PATTERNS = '{"patterns":["<your-private-pattern>"],"probe":"<value-your-pattern-matches>"}'
```

bash:

```bash
export COMPASS_PRIVATE_PATTERNS='{"patterns":["<your-private-pattern>"],"probe":"<value-your-pattern-matches>"}'
```

Set it for the current shell session only; do not write it into a file that
could be committed.

### Behavior

Enforcement depends on which command invoked the check, not only on whether
`CI` is set:

- `pnpm check` with `CI` set (GitHub Actions) or with `pnpm check --strict`:
  enforced.
- `pnpm check` run locally without `--strict`, `CI` unset: the variable may
  be left unset; the check prints `private-patterns: skipped (env unset)`
  and exits 0.
- `pnpm check:paste` (see "Before pasting into a public issue or PR" below):
  always enforced, regardless of `CI` or `--strict`. The only purpose of
  this subcommand is to check text that is about to become public, so
  silently skipping the check because the variable happens to be unset
  would defeat the point.

Whenever enforcement applies, the variable must be set, valid JSON, contain
at least one pattern that compiles as a regular expression, and its `probe`
must match one of those patterns. Any failure is fail-closed (exit 1) with
one of the fixed messages below — never the pattern or probe value itself.

### Fixed failure messages

| ruleId | Meaning |
| --- | --- |
| `forbidden-patterns:env-unset` | `COMPASS_PRIVATE_PATTERNS` is required here (CI, `--strict`, or `check:paste`) but not set |
| `forbidden-patterns:invalid-json` | The value is not valid JSON, or has no `patterns` |
| `forbidden-patterns:invalid-regexp` | One of `patterns` does not compile as a regular expression |
| `forbidden-patterns:probe-mismatch` | `probe` does not match any compiled pattern |

## Before pasting into a public issue or PR

An issue, a PR description, and a PR or issue comment are all public surface
— pasting the output of `/context`, a test run, or a shell session into one
can carry a local filesystem path or another private string along with it,
the same way a tracked file can.

`pnpm check:paste` runs the same generic and private-pattern checks
`forbidden-patterns` runs against tracked files, against a single piece of
text instead. Before pasting, pipe the text through it:

PowerShell:

```powershell
Get-Clipboard | pnpm check:paste
```

bash:

```bash
pnpm check:paste <<< "$(pbpaste)"
```

It reads `COMPASS_PASTE_BODY` if that environment variable is set, and
falls back to stdin otherwise. It never prints the matched text itself —
only a `path:line ruleId` per finding, with the fixed path `(stdin)` — and
it always enforces `COMPASS_PRIVATE_PATTERNS` (see "Behavior" above), so it
must be set in the current shell first.

The `public-surface.yml` workflow runs the same check automatically against
every issue, pull request, and comment (except on an issue whose milestone
is `M0` or `M1`), and adds a fixed-wording comment and the
`needs-redaction` label when it finds a match — it does not repeat the
matched text either. This is a safety net for what `pnpm check:paste` was
meant to catch locally, not a replacement for running it before pasting.

A pull request opened from a fork does not receive repository secrets, so
`COMPASS_PRIVATE_PATTERNS` is unset in that run and the workflow's check
fails closed on `forbidden-patterns:env-unset` — the same fail-closed
behavior `check:paste` always has, just triggered by an environment this
workflow cannot avoid. This is a known limitation, not a bug: it means a
fork-originated PR's `check-paste` job fails every time until this
repository's contribution path for forks is decided separately.
