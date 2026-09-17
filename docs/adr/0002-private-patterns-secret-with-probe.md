# ADR-0002: Private patterns live in a CI secret with a self-test probe; fail-closed in CI

Status: accepted

Issue: #9
Date: 2026-09-17

## Context

The `forbidden-patterns` check (#8) must catch a maintainer's private strings — a real name, a home directory, an internal hostname — that no generic pattern can anticipate. Those strings cannot live in the repository as literal text or as a checked-in pattern list: a public repository cannot un-publish history, and the pattern itself would leak what it is trying to hide the moment it is committed.

A pattern list held only outside the repository has its own failure mode: "zero matches" is the expected result on a clean file, but it is also what an unset variable, malformed JSON, or a typo'd regular expression produces. Without a way to tell those apart, the check could report success for the wrong reason indefinitely.

## Decision

Private patterns are supplied at check time through an environment variable, `COMPASS_PRIVATE_PATTERNS`, holding a JSON object `{patterns: [...], probe: "..."}`. In CI this variable is populated from a GitHub Actions secret (with the corresponding Dependabot secret registered alongside it, per #1, so Dependabot's own PRs run the same check); locally, each maintainer sets it in their shell.

`probe` is a self-test value that must match at least one compiled pattern. The check treats these as equally fatal, fails closed (exit 1) on each with a fixed message that never includes the pattern or probe text, and requires `CI` or `--strict` for these to be enforced (a bare local run without the variable set is allowed to skip, printing a state word instead of failing):

- the variable is unset
- the value is not valid JSON, or has no patterns
- a pattern does not compile as a regular expression
- `probe` matches none of the compiled patterns

Each pattern and the probe are also registered with the GitHub Actions `::add-mask::` workflow command before anything else touches them, as a second layer of defense: `try`/`catch` around parsing, compilation, and matching is what keeps the value out of the check's own output, and masking covers the case where something downstream logs it anyway.

## Consequences

Generic patterns stay in the repository as ordinary, reviewable data; only the values that would identify the maintainer leave it. The self-test probe turns a silent misconfiguration (the common failure mode for anything gated by an environment variable) into a build failure with a diagnosable, fixed message, at the cost of requiring every maintainer to keep their own probe value in sync with their own patterns.
