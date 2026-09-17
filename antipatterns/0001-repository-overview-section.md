---
id: "0001"
title: A repository-overview section in the instruction file
status: active
topic: instruction-files
applies_to:
  - general
rule: Do not add a repository-overview section to an instruction file; a controlled study found it does not help while context files overall raised inference cost.
license: CC-BY-4.0
classification: harmful
relates_to:
  - "0001"
sources:
  - url: https://arxiv.org/abs/2602.11988
    kind: research
    confidence: verified
    verified_on: "2026-09-17"
    summary: A 2026 study of AGENTS.md-style context files found that repository-overview sections specifically, despite being popular and recommended by model providers, were not helpful, while context files overall raised inference cost by more than 20% without a general gain in task success.
    quote: "we find that providing context files does not generally improve task success rates, while increasing inference cost by over 20% on average. This observation holds across different LLMs, coding agents, and for both LLM-generated and developer-committed context files."
---

## Symptom

The instruction file opens with a section describing the repository's purpose, architecture, or module layout, largely duplicating what a README's project-description section already covers.

## Cause

Repository overviews are popular and recommended by several model providers as a way to orient an agent before it starts working, on the assumption that more upfront context yields better task performance.

## Remedy

Drop the repository-overview section. The same "would removing this cause a mistake" test that argues for keeping always-loaded instructions minimal in general (see the sibling practice on that topic) applies here specifically: an agent that needs architectural detail can read the code, and the measured evidence is that a repository overview does not move task success while it does raise cost.
