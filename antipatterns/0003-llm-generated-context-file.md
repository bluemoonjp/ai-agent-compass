---
id: "0003"
title: Committing an LLM-generated context file without substantial editing
status: active
topic: instruction-files
applies_to:
  - general
rule: Do not commit an AGENTS.md or CLAUDE.md an LLM generated and left as-is; a study found it did not reliably beat having no file, while a developer-written one significantly outperformed it.
license: CC-BY-4.0
classification: harmful
relates_to:
  - "0001"
sources:
  - url: https://arxiv.org/abs/2602.11988
    kind: research
    confidence: verified
    verified_on: "2026-09-19"
    summary: A controlled study found LLM-generated context files caused performance drops in most of the settings tested, with neither benchmark's drop reaching statistical significance, while inference cost rose by more than 20% on average.
    quote: "LLM-generated context files cause performance drops in 5 out of 8 settings across SWE-bench and CTXbench"
  - url: https://arxiv.org/abs/2602.11988
    kind: research
    confidence: verified
    verified_on: "2026-09-19"
    summary: The same study found developer-provided context files significantly outperformed the LLM-generated ones, unlike the LLM-generated files' own null effect against having no context file at all.
    quote: "Developer-provided context files improve agent performance by 2.4% on average (p=21%), significantly outperforming LLM-generated ones (p=3.8%)"
---

## Symptom

The project's `AGENTS.md` or `CLAUDE.md` reads like it was generated in one pass and never substantially edited afterward. This often looks generic — a codebase overview that just restates directory names, conventions that sound plausible but don't reflect anything a maintainer actually decided — but a confidently specific file can hide the same problem: named modules, build commands, or conventions that read as decided because the model wrote them fluently, when nobody actually checked them against what the repository does.

## Cause

Asking an agent to generate its own context file is fast, and the result looks complete, so it is tempting to commit it as-is instead of treating it as a first draft. The same evaluation that measured this found LLM-generated files raise inference cost by more than 20% on average without a corresponding, statistically significant gain in task success — the file looks like it should help and mostly doesn't, while making every subsequent run more expensive.

## Remedy

Treat an LLM-generated context file as a draft that a maintainer edits before it is trusted, not as a finished artifact. The same study found developer-provided context files significantly outperformed the LLM-generated ones, so the gap this antipattern describes isn't between having a file and not — it's between a file someone actually reviewed and one nobody did. The sibling practice on keeping always-loaded instructions minimal applies here too: an LLM asked to write a context file tends to produce exactly the kind of generic, padded content that practice argues for cutting.
