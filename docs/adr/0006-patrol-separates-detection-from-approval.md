# ADR-0006: Weekly patrol separates unattended detection from human-approved advance

Status: accepted

Issue: #30
Date: 2026-09-19

## Context

A source cited by `practices/` or `antipatterns/` can change without this repository noticing; nothing currently re-reads a source after the file that cites it was written. Two different triggers call for re-checking a source, and they have very different costs. A weekly check across every registered source is cheap only if it never needs a model: it must reduce to an HTTP fetch and a byte-level diff against what was last accepted. A tool or model release, by contrast, calls for a human (or an agent acting for one) to actually read the new content and judge whether a rule still holds — that judgment cannot be reduced to a diff. Treating both triggers the same way forces a choice between two failures: running an LLM every week to catch a change that is usually a no-op, or skipping the weekly pass and letting drift accumulate until the next release-driven review, however long that is.

Whatever process performs the weekly pass writes *some* state — at minimum, "I checked this source and here is what I saw." That state has to live somewhere a fully unattended process can update it, or the pass cannot run unattended at all; but `main` and `sources/baseline.json` are exactly the two places this repository's other decisions (branch protection, `ci: registry-check`) already treat as requiring a human-reviewed PR. Where the unattended pass writes its own observations, separately from where a human accepts that those observations should become the new baseline, is the question this ADR settles.

## Decision

The weekly pass splits into two stages that never share a write path. An unattended stage (a scheduled GitHub Actions workflow) fetches every registered source, diffs each against the last *accepted* baseline, and, only when something changed, opens an Issue naming what changed — no model call, no PR, no write to `main`. A human-triggered stage (the `/compass-weekly` skill) reads that Issue, re-reads the actual source content, updates whatever `practices/`/`antipatterns/` files the change affects (or records that nothing needs to change), and opens a normal PR that advances `sources/baseline.json`. `main` advances only through that PR, the same as every other change to this repository.

A Claude Code model release is a different trigger with the same shape: the weekly pass can detect that a `whats-new` or `changelog` source changed, but only a human can judge whether that change was a model release and whether it makes any existing rule stale. `docs/maintain/model-release.md` is the human-triggered procedure for that judgment, kept separate from `/compass-weekly` because a model release calls for reviewing every Claude-Code-scoped practice and undetermined antipattern at once, not just the one source that happened to change.

The one place an unattended commit is allowed at all is a dedicated `patrol-state` branch holding a single `state.json`: the unattended stage's own working notes (what it observed on this run), not the accepted baseline. `patrol-state` is not protected the way `main` is, and nothing downstream treats its content as approved; it exists only so the next unattended run has something to diff against and so the workflow can tell whether it is still alive.

Four places to hold that state were considered:

- **Commit to `main` through a PR for every observation, even an unchanged one.** This is what branch protection on `main` already exists to prevent an unattended process from doing, and it would turn a no-op weekly check into a PR someone has to review every week regardless of whether anything actually changed.
- **GitHub Actions cache or workflow artifact.** Both are scoped to the workflow and expire (caches evict under storage pressure, artifacts have a fixed retention window); a state that must survive from one week's run to the next has no guarantee of doing so, and neither one is readable as a normal repository file without extra tooling.
- **The body of a single, continuously-edited Issue.** An Issue body has no history a diff can be taken against and no schema a script can validate; treating free text as the only copy of the last-known state makes that state one accidental edit away from being lost, with no record of what it used to say.
- **A dedicated `patrol-state` branch's `state.json` (adopted).** A branch is a normal git object: it has history, `git log` shows what changed between runs, and a script reads it the same way it reads any other tracked file. Keeping it separate from `main` means the unattended stage's own commits never touch the branch that requires human review, so the two write paths cannot collide.

`sources/baseline.json`'s `verified_on` and `acceptedOn` fields answer two different questions and are not two representations of the same fact. `sources[].verified_on`, on a practice or antipattern file, records the last date a human actually read the source prose and confirmed it still supports the rule. `sources/baseline.json`'s `acceptedOn` records the last date a human accepted a particular observed byte state (an etag or an md5) as the current known-good state of that source, whether or not anything in `practices/`/`antipatterns/` needed to change as a result. A source can be re-accepted at an unchanged `verified_on` (nothing worth re-reading happened) and a practice's `verified_on` can advance without `acceptedOn` changing (a human re-read the same accepted bytes and confirmed the rule again). Conflating them would make it impossible to tell, from the file alone, which kind of check last happened.

## Consequences

Detecting drift now costs GitHub Actions minutes on a public repository (free) plus, on the weeks something actually changed, one `/compass-weekly` run. A week with no drift costs nothing beyond the scheduled workflow itself. This rules out ever having the unattended stage decide, on its own, that a practice's content should change — that judgment stays with whatever reads the Issue the unattended stage opens.

This decision is worth revisiting if any of the following happens: a registered source retires the machine-readable form (for instance, an `llms.txt`) the unattended stage currently fetches, forcing a heavier per-source check than a byte diff; the unattended stage fails to fetch a source for enough consecutive runs that a byte diff stops being a meaningful signal; or a maintainer determines that a commit the unattended stage makes to `patrol-state` should not count as repository activity for some purpose that cares about that distinction, which would call for a different place to record liveness than a commit history.
