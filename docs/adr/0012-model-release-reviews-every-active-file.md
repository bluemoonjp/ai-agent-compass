# ADR-0012: A model release reviews every active practice and antipattern, not a frontmatter-selected subset

Status: accepted

Issue: #127
Date: 2026-10-08

## Context

`pnpm patrol:review-list` was built to select, from frontmatter alone, the files a Claude Code model release could make stale: active practices whose `applies_to` includes `claude-code`, and antipatterns still classified `undetermined`. A full re-verification of every file after a model release showed the selection leaving out files whose sources had newer, model-relevant evidence.

Frontmatter records which tool a file applies to (`applies_to`) and what kind each source is (`kind`). It does not record whether the claim depends on how a model behaves, and that is the property a model release changes. Two independent panels classified every active practice and antipattern by that property and agreed on all of them. Measured against that classification, every frontmatter-derived scope had both kinds of error: model-dependent files it left out, and files that do not depend on the model that it included. The current scope left out most of the model-dependent files; adding a `kind: research` condition and a model-name condition reduced the misses without removing them and added more files that do not depend on the model; the model-name condition added nothing the research condition had not already selected.

An explicit frontmatter field saying "this claim depends on the model" would remove the errors only if its value is right at the time it is written. Writing it moves the judgment to authoring time, and nothing re-checks that judgment later.

## Decision

A model-release review covers every active practice and every active antipattern. `pnpm patrol:review-list` prints all of them and applies no narrowing condition. Adapters are out of scope: they describe other tools' mechanisms, which the weekly patrol covers.

This amends ADR-0006's sentence that a model release "calls for reviewing every Claude-Code-scoped practice and undetermined antipattern at once": the scope is every active practice and antipattern.

## Consequences

Reviewing every file does not raise the human cost, because `docs/maintain/model-release.md` step 2 re-verifies each id independently, gives every verdict other than `holds` to a separate adversarial reviewer, and leaves only those verdicts to a person. The files that do not depend on the model produce `holds`, which no one reads.

The list now grows with the corpus, so the cost of the re-verification grows with it. If a full pass stops being practical, the next candidate is an explicit frontmatter field marking model-dependent claims, with the authoring-time risk described above.
