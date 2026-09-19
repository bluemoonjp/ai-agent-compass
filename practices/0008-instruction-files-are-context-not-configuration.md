---
id: "0008"
title: Instruction files are context Claude tries to follow, not configuration that guarantees compliance
status: active
topic: instruction-files
applies_to:
  - claude-code
rule: Treat instruction files as context with no guarantee of compliance; a requirement that must hold with zero exceptions belongs in a hook, a permission rule, or an external gate such as CI, not prose.
license: CC-BY-4.0
sources:
  - url: https://docs.claude.com/en/docs/claude-code/memory
    kind: primary
    confidence: verified
    verified_on: "2026-09-19"
    summary: Claude Code's memory documentation states that Claude treats CLAUDE.md and auto memory as context rather than enforced configuration, and that blocking an action regardless of what Claude decides requires a PreToolUse hook instead.
    quote: "Claude treats them as context, not enforced configuration. To block an action regardless of what Claude decides, use a PreToolUse hook instead."
  - url: https://docs.claude.com/en/docs/claude-code/memory
    kind: primary
    confidence: verified
    verified_on: "2026-09-19"
    summary: The same documentation, troubleshooting why an instruction wasn't followed, states that Claude reads CLAUDE.md and tries to follow it, but there is no guarantee of strict compliance, especially for vague or conflicting instructions.
    quote: "Claude reads it and tries to follow it, but there's no guarantee of strict compliance, especially for vague or conflicting instructions."
---

## Why

An instruction file is delivered to Claude as a message it reads and reasons about, not as a mechanism the runtime enforces; writing a rule into CLAUDE.md does not by itself change what tool calls Claude Code will actually let through. A `PreToolUse` hook or a `permissions.deny` entry runs deterministically before an action executes, which is the only way to guarantee an outcome regardless of what Claude decides on a given turn. This is a different problem from the sibling practice on keeping always-loaded instructions minimal: that practice is about which content earns a place in the file at all, while this one is about what an instruction file, by its nature, can and cannot promise once a line is in it.

## When it applies

Applies to any requirement an author is tempted to state as prose in CLAUDE.md, AGENTS.md, or a rule file because Claude usually follows it. The deterministic alternative is not limited to a hook or a permission rule — any gate the requirement actually runs through outside the live agent turn, such as a required CI check or branch protection, serves the same purpose. It does not apply to guidance where an occasional miss is an acceptable cost, or to something no deterministic mechanism can express, such as a stylistic preference or a design judgment — prose is still the right tool there.
