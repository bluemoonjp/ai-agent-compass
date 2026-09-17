---
id: "0002"
title: Emphasis everywhere
status: active
topic: instruction-files
applies_to:
  - claude-code
rule: Do not add emphasis such as "IMPORTANT" to many lines of an instruction file; emphasizing everything leaves none of it standing out.
license: CC-BY-4.0
classification: harmful
relates_to:
  - "0001"
sources:
  - url: https://www.anthropic.com/engineering/claude-code-best-practices
    kind: primary
    confidence: verified
    verified_on: "2026-09-18"
    summary: Anthropic's Claude Code best-practices guide warns that emphasizing many lines in CLAUDE.md backfires, recommending emphasis such as "IMPORTANT" be reserved for the single line an agent keeps skipping.
    quote: "If Claude keeps skipping one instruction, add emphasis such as “IMPORTANT” to that line alone. If you emphasize many lines, none of them stands out."
---

## Symptom

Many lines of an instruction file carry emphasis markers — ALL CAPS, bold text, "IMPORTANT", "CRITICAL", "MUST" — spread across most of the file's content instead of reserved for a single line.

## Cause

Emphasis reads as a lever: when the agent skips an instruction, adding emphasis to that line looks like the fix, and it appears to work in isolation. An author who reaches for that lever once per skipped instruction ends up applying it wherever an instruction matters, which in most instruction files is nearly everywhere.

## Remedy

Reserve emphasis for the one instruction the agent actually keeps skipping, and leave the rest of the file at normal weight. Anthropic's own CLAUDE.md guidance is explicit that emphasizing many lines leaves none of them standing out — emphasis only works as a contrast against a plain background, and a file that is emphasis-everywhere has no background left to contrast against. See the sibling practice on keeping always-loaded instructions minimal for the companion problem of length, distinct from the density of emphasis addressed here.
