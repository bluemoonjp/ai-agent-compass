---
id: "0004"
title: Write one canonical rule; contradictions may be resolved arbitrarily
status: active
topic: instruction-files
applies_to:
  - claude-code
rule: Write and maintain one canonical rule per topic; if two instructions contradict each other, the agent may pick one arbitrarily rather than flag the conflict.
license: CC-BY-4.0
sources:
  - url: https://docs.claude.com/en/docs/claude-code/memory
    kind: primary
    confidence: verified
    verified_on: "2026-09-18"
    summary: Claude Code's memory documentation states that when two CLAUDE.md rules contradict each other, Claude may pick one arbitrarily, and recommends removing the conflict rather than relying on a consistent resolution.
    quote: "Consistency: if two rules contradict each other, Claude may pick one arbitrarily."
  - url: https://developers.openai.com/codex/guides/agents-md
    kind: primary
    confidence: verified
    verified_on: "2026-09-18"
    summary: OpenAI's Codex documentation describes a deterministic merge instead of an arbitrary pick, AGENTS.md files concatenate from the project root down, and a file closer to the working directory overrides earlier guidance by position.
    quote: "Codex concatenates files from the root down, joining them with blank lines. Files closer to your current directory override earlier guidance because they appear later in the combined prompt."
---

## Why

Claude Code's memory documentation offers no tie-breaker for two contradictory rules beyond chance: it states that when two rules contradict each other, Claude may pick one arbitrarily, and it recommends periodically reviewing instruction files to remove the conflict rather than trusting the agent to favor one side consistently. A file with two rules that disagree is not a file with a predictable fallback; its actual behavior on a given task only reveals itself at run time, and can change between sessions.

## When it applies

Applies to a single instruction file, and to how nested CLAUDE.md files, imports, and `.claude/rules/` entries combine into one context. Restating a rule more forcefully in a second location does not settle which one governs; it creates the exact ambiguity the source describes. It does not apply to two rules that are correctly scoped to disjoint situations, such as a path-specific rule and a general rule that never both fire on the same file, since that is not a contradiction.

## Conflicting guidance

Sources disagree about whether "arbitrary" is even the right description of how a contradiction resolves. Claude Code's documentation calls the outcome arbitrary. OpenAI's own documentation of Codex's `AGENTS.md` discovery describes a deterministic merge instead: files are concatenated from the project root down, and a file closer to the working directory overrides earlier guidance because it appears later in the combined prompt — position, not chance, decides which side wins. Either way the fix is the same: write one canonical rule per topic instead of relying on either mechanism, since neither an arbitrary pick nor a positional override is something an author should design around.
