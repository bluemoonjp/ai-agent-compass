# ADR-0001: Two layers: deliverable (A) and repository operations (B)

Status: amended by ADR-0004

Issue: #9
Date: 2026-09-17

## Context

This repository has two audiences for its instruction text. Layer A is the deliverable: `practices/`, `antipatterns/`, `adapters/`, `templates/`, and the plugin's `SKILL.md` files, written to be read by an agent working in *some other* project. Layer B is this repository's own operations: the root `AGENTS.md` and `CLAUDE.md`, `.claude/`, and `docs/maintain/`, written to be read by an agent working *on this repository*.

Left unstated, the two blur together. A practice's title or rationale creeps into `AGENTS.md` because it happens to be the rule the maintainer wants enforced right now, and the root instruction file grows without bound. Worse, this repository is itself a target for the antipattern it may document (an always-loaded file that should have been a hook, a repository-overview section that goes stale) — if the boundary is not named, the repository has no way to notice it is breaking its own advice.

## Decision

Keep the two layers separate by convention and by check:

- Layer A is written for another project's agent. It never assumes this repository's tooling, file layout, or check registry.
- Layer B is written only for an agent working on this repository. It never restates a Layer A practice's title, ID, or rule text — it may enforce one, but always by reference (`enforces` in `checks.json`, or `not_applicable.json`), never by repetition.
- This repository follows its own Layer A advice (dogfooding): if a practice says always-loaded instructions must be minimal, this repository's own `AGENTS.md`/`CLAUDE.md` must be minimal too, and a check enforces the limit rather than trusting prose.

The check `layer-b-no-a-content` (added in a later issue) is a coarse proxy for this boundary: it greps `AGENTS.md`, `CLAUDE.md`, and `docs/maintain/` for the shape of a practice ID or title and fails if one appears. It cannot detect every violation of the boundary — only that specific, mechanically-checkable one — and `checks.json`'s `protects` field for that check says so.

## Consequences

This makes it possible to check the deliverable and the repository's own operation against different, sometimes conflicting, constraints (Layer A must work when copied into a project with none of this repository's tooling; Layer B must stay small enough to always-load) without one silently absorbing the other's content over time.

It does not solve human review on a single-maintainer repository. GitHub cannot require a second human's approval when there is only one maintainer, so a required-reviewers rule is not available here. The Claude Code path is narrowed in two tiers instead: `.claude/settings.json`'s `permissions.deny` blocks secret management, repository deletion and visibility changes, GraphQL calls, and arbitrary git-ref manipulation outright; merging a pull request, publishing a release, and pushing a tag are not in `permissions.deny` and instead fall through to the auto mode classifier's own soft_deny handling, which refuses them by default but allows them once the user names the specific action (see ADR-0004). Either way, an agent working through Claude Code cannot merge its own work or touch the repository's trust boundary unsupervised. This is a mitigation for one agent, not a substitute for review: it has no effect on any other agent or on a human running the same commands directly, and it is recorded here as a known limitation rather than a solved problem.
