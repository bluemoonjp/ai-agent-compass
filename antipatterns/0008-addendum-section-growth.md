---
id: "0008"
title: Appending notes to a growing section instead of editing in place
status: active
topic: instruction-files
applies_to:
  - general
rule: Do not append a new note to an Addendum or Updates section of a living instruction file; edit the relevant section in place so the file states one current answer, not accumulated layered ones.
license: CC-BY-4.0
classification: harmful
relates_to:
  - "0004"
sources:
  - url: https://arxiv.org/pdf/2511.12884v2
    kind: research
    confidence: verified
    verified_on: "2026-09-19"
    summary: An empirical study of 2,303 agent context files across 1,925 repositories found these files evolve through frequent, small additions, risking unstructured append-only logs unless developers apply versioning and keep a separate changelog.
    quote: "Given that agent context files grow through frequent, small additions (Section 4.2), they risk becoming unstructured append-only logs."
---

## Symptom

An instruction file has an "Addendum" or "Updates" heading that keeps growing — each edit adds one more note at the bottom instead of changing the relevant section directly, so old and new guidance sit side by side with no indication which one still applies. This is a different thing from a genuinely versioned migration guide, where sections conditioned on a version number ("if you're on v1, do X; on v2, do Y") stay because readers on different versions still need different answers — that isn't accumulated confusion, it's current guidance for more than one audience.

## Cause

Appending feels safer than editing: the original text stays intact, and adding a note at the end is a smaller, more reviewable diff than rewriting a paragraph in place. Each individual addition looks reasonable on its own; nothing about any single edit forces revisiting whether the growing section still reads as one coherent instruction.

## Remedy

Edit the relevant section directly instead of appending a note elsewhere in the file. An empirical study of 2,303 agent context files across 1,925 repositories found that these files evolve through exactly this pattern of frequent, small additions, and warns that the growth risks turning them into unstructured append-only logs — its own recommendation is not to avoid a changelog altogether, but to apply semantic versioning and keep a separate, deliberately maintained changelog artifact rather than letting undated notes accumulate inside the instructions themselves. The distinction that matters is between a dedicated, structured changelog kept apart from current guidance, and an in-place pile of notes that an agent has to sort through to find which one still applies at the moment it acts; only a single, current statement in the relevant section answers that, the same reasoning that argues for one canonical rule per topic rather than several that might disagree.
