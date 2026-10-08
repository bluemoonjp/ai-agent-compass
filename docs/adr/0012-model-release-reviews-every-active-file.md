# ADR-0012: A model release reviews every active practice and antipattern, not a frontmatter-selected subset

Status: accepted

Issue: #127
Date: 2026-10-08

## Context

`pnpm patrol:review-list` selected, from frontmatter alone, the files a Claude Code model release could make stale: active practices whose `applies_to` includes `claude-code`, and antipatterns classified `undetermined`. A selection derived from frontmatter misses model-dependent files, because frontmatter does not say whether a claim depends on the model.

Frontmatter records which tool a file applies to (`applies_to`) and what kind each source is (`kind`). It does not record whether the claim depends on how a model behaves, and that is the property a model release changes. Two independent panels classified every active practice and antipattern by that property and agreed on all of them (the counts per candidate scope are recorded in the Issue above). Measured against that classification, every frontmatter-derived scope had both kinds of error: model-dependent files it left out, and files that do not depend on the model that it included. The previous scope left out most of the model-dependent files; adding a `kind: research` condition and a model-name condition reduced the misses without removing them and added more files that do not depend on the model; the model-name condition added nothing the research condition had not already selected.

## Decision

A model-release review covers every active practice and every active antipattern. `pnpm patrol:review-list` prints all of them and applies no narrowing condition. Adapters are out of scope: they describe other tools' mechanisms, which the weekly patrol covers.

This amends ADR-0006's sentence that a model release "calls for reviewing every Claude-Code-scoped practice and undetermined antipattern at once": the scope is every active practice and antipattern. A `holds` verdict advances `sources[].verified_on` once an independent reviewer has failed to overturn it, without a person reading it; ADR-0006's "a human actually read" is satisfied by an agent acting for the maintainer in that case.

## Consequences

Reviewing every file is workable only because the re-verification procedure in `docs/maintain/model-release.md` checks each id independently and has every verdict, `holds` included, challenged by a separate reviewer before only the contested or non-`holds` ones reach a person; the human cost follows that procedure, not the size of the list.

The list now grows with the corpus, so the cost of the re-verification grows with it. If a full pass stops being practical, the next candidate is an explicit frontmatter field marking model-dependent claims. It would remove the errors only if its value is right when written, which moves the judgment to authoring time, where nothing re-checks it later.
