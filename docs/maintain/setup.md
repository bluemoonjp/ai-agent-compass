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

- `CI` set (GitHub Actions) or `pnpm check --strict`: the variable must be
  set, valid JSON, contain at least one pattern that compiles as a regular
  expression, and its `probe` must match one of those patterns. Any failure
  is fail-closed (exit 1) with one of the fixed messages below — never the
  pattern or probe value itself.
- Local run without `CI` and without `--strict`, variable unset: the check
  prints `private-patterns: skipped (env unset)` and exits 0.

### Fixed failure messages

| ruleId | Meaning |
| --- | --- |
| `forbidden-patterns:env-unset` | `COMPASS_PRIVATE_PATTERNS` is required here (CI or `--strict`) but not set |
| `forbidden-patterns:invalid-json` | The value is not valid JSON, or has no `patterns` |
| `forbidden-patterns:invalid-regexp` | One of `patterns` does not compile as a regular expression |
| `forbidden-patterns:probe-mismatch` | `probe` does not match any compiled pattern |
