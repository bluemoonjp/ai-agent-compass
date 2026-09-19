---
id: "0010"
title: Target CLAUDE.md at under 200 lines
status: active
topic: instruction-files
applies_to:
  - claude-code
rule: Keep each CLAUDE.md file under roughly 200 lines; once it grows past that, move directory- or file-type-specific content into path-scoped rules instead of continuing to grow the always-loaded file.
license: CC-BY-4.0
sources:
  - url: https://docs.claude.com/en/docs/claude-code/memory
    kind: primary
    confidence: verified
    verified_on: "2026-09-19"
    summary: Claude Code's memory documentation gives a concrete size target for CLAUDE.md, stating that a longer file consumes more context and reduces how reliably Claude follows it.
    quote: "Size: target under 200 lines per CLAUDE.md file. Longer files consume more context and reduce adherence."
---

## Why

This is a specific, numeric form of the more general principle that an always-loaded file should stay minimal: Claude Code's own documentation ties file length directly to adherence, stating that a longer CLAUDE.md consumes more context and reduces how reliably Claude follows its own instructions. 200 lines is not a hard cutoff the tool enforces; it is the point past which the same documentation recommends moving content out rather than continuing to grow a file every session pays for.

## When it applies

Applies to the root CLAUDE.md and to any other CLAUDE.md loaded unconditionally at launch, such as a user-level file with no path scoping. It does not apply to a file that only loads on demand, such as a nested CLAUDE.md in a subdirectory or a `.claude/rules/` file scoped with `paths`, since a file that isn't loaded at every launch doesn't compete with startup context the same way. Splitting an oversized file into `@path` imports or into unscoped `.claude/rules/` entries does not satisfy the goal this target serves: both still load unconditionally at every launch, so the 200-line budget is best read as covering everything a session loads by default, not the byte count of one file alone.
