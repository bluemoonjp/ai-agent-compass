---
id: "0001"
title: Keep always-loaded instructions minimal
status: active
topic: instruction-files
applies_to:
  - claude-code
rule: Keep CLAUDE.md and AGENTS.md minimal; convert anything that must happen every time with zero exceptions into a hook instead of prose.
license: CC-BY-4.0
sources:
  - url: https://www.anthropic.com/engineering/claude-code-best-practices
    kind: primary
    confidence: verified
    verified_on: "2026-09-17"
    summary: Anthropic's Claude Code best-practices guide recommends keeping CLAUDE.md concise, since a bloated always-loaded file causes Claude to ignore its actual instructions.
    quote: "Keep it concise. For each line, ask: \"Would removing this cause Claude to make mistakes?\" If not, cut it. Bloated CLAUDE.md files cause Claude to ignore your actual instructions!"
  - url: https://www.anthropic.com/engineering/claude-code-best-practices
    kind: primary
    confidence: verified
    verified_on: "2026-09-17"
    summary: The same guide distinguishes CLAUDE.md's advisory instructions from hooks, which run deterministically and are guaranteed to happen.
    quote: "Use hooks for actions that must happen every time with zero exceptions."
---

## Why

An always-loaded instruction file competes for context on every turn. Anthropic's own guidance for Claude Code observes that a long `CLAUDE.md` causes the agent to ignore its actual instructions, and separately distinguishes `CLAUDE.md`'s advisory rules from a hook's deterministic guarantee. Together these point at the same fix: keep the always-loaded file to what genuinely needs to be always loaded, and move anything that must happen with zero exceptions into a hook, where the harness enforces it instead of prose merely requesting it.

## When it applies

Applies to Claude Code's `CLAUDE.md` and, by the same reasoning, to any other tool's always-loaded instruction file paired with an equivalent deterministic mechanism (a pre-commit hook, a linter, a required CI check). It does not apply to guidance that is genuinely conditional or exploratory, since a hook can only enforce a fixed, deterministic action.
