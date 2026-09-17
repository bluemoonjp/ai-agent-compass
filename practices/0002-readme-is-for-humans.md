---
id: "0002"
title: README is for humans
status: active
topic: docs
applies_to:
  - general
rule: Keep README.md focused on humans (quick starts, project descriptions, contribution guidelines) and put agent-specific context in AGENTS.md instead.
license: CC-BY-4.0
sources:
  - url: https://agents.md/
    kind: primary
    confidence: verified
    verified_on: "2026-09-17"
    summary: The AGENTS.md specification site explains that AGENTS.md exists so README.md can stay focused on human readers, while agent-facing build, test, and convention detail moves to a separate file.
    quote: "README.md files are for humans: quick starts, project descriptions, and contribution guidelines."
---

## Why

Mixing agent-facing build steps, conventions, and gotchas into a README makes it worse for the humans it is for: a first-time contributor has to skim past detail meant for an agent to find the quick start. The AGENTS.md specification exists precisely to give agent-facing content its own home so the README can stay a human-facing entry point.

## When it applies

Applies whenever a project maintains both a README and an agent instruction file (`AGENTS.md`, `CLAUDE.md`, or equivalent). It does not apply to a project with no agent-facing instructions at all, where the README is the only entry point either audience has.
