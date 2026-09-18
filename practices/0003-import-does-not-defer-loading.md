---
id: "0003"
title: "@import does not defer loading"
status: active
topic: instruction-files
applies_to:
  - claude-code
rule: An @path import in CLAUDE.md is expanded into context at launch alongside the file that references it; it does not load lazily when the agent later needs it.
license: CC-BY-4.0
sources:
  - url: https://docs.claude.com/en/docs/claude-code/memory
    kind: primary
    confidence: verified
    verified_on: "2026-09-19"
    summary: Claude Code's memory documentation states that @path imports are expanded and loaded into context at launch alongside the referencing CLAUDE.md, not deferred until the agent later needs the imported file.
    quote: "Imported files are expanded and loaded into context at launch alongside the CLAUDE.md that references them."
  - url: https://docs.claude.com/en/docs/claude-code/memory
    kind: primary
    confidence: verified
    verified_on: "2026-09-19"
    summary: Claude Code's memory documentation states that imported files may recursively import other files up to a maximum nesting depth of four hops.
    quote: "Imported files can recursively import other files, with a maximum depth of four hops."
---

## Why

Claude Code's own memory documentation describes an `@path/to/file` import as text that is expanded and loaded into context at launch, alongside the CLAUDE.md file that references it. Nothing about the import is deferred until the agent needs that file for a specific task; the imported content is already present in context from the first turn, the same as if it had been pasted inline. An import is a way to organize an always-loaded file across multiple files, not a way to make part of it load only when relevant.

## When it applies

Applies to any `@path/to/file` import inside a CLAUDE.md (or CLAUDE.local.md) file that Claude Code reads, including an import nested inside another imported file, up to the source's documented four-hop depth. It does not apply to a path merely mentioned in backticks, which the same documentation treats as literal text rather than an import, and it makes no claim about how another tool's own include or reference mechanism behaves.
