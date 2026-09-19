---
id: "0012"
title: Context window reliability degrades with input length, even on simple tasks
status: active
topic: context
applies_to:
  - general
rule: Do not assume a model uses its full context window uniformly; treat added context as a cost that can lower reliability on its own, and keep loaded context small regardless of the window's rated size.
license: CC-BY-4.0
sources:
  - url: https://www.trychroma.com/research/context-rot
    kind: research
    confidence: verified
    verified_on: "2026-09-19"
    summary: Chroma's Context Rot technical report evaluated 18 LLMs, including GPT-4.1, Claude 4, Gemini 2.5, and Qwen3 models, and found that model performance varies significantly as input length changes, even on simple tasks.
    quote: "We observe that model performance varies significantly as input length changes, even on simple tasks."
  - url: https://www.trychroma.com/research/context-rot
    kind: research
    confidence: verified
    verified_on: "2026-09-19"
    summary: The same report states that performance grew increasingly unreliable as input length grew, contrary to the common assumption that a model processes every position in its context window equally reliably.
    quote: "models do not use their context uniformly; instead, their performance grows increasingly unreliable as input length grows"
  - url: https://www.trychroma.com/research/context-rot
    kind: research
    confidence: verified
    verified_on: "2026-09-19"
    summary: The same report states it evaluated 18 LLMs, including GPT-4.1, Claude 4, Gemini 2.5, and Qwen3 models, which is the basis for its claim that the effect holds broadly rather than in one model family.
    quote: "we evaluate 18 LLMs, including the state-of-the-art GPT-4.1, Claude 4, Gemini 2.5, and Qwen3 models"
---

## Why

It is tempting to treat a model's rated context window as a uniform budget: if the task fits, the task should work. Evaluating 18 LLMs, including GPT-4.1, Claude 4, Gemini 2.5, and Qwen3 models, Chroma's Context Rot report found that performance instead grows increasingly unreliable as input length grows, even on simple tasks where difficulty is not the confound. Two long documents are not interchangeable just because both fit the window; the longer one measurably costs more. This is a broader, independently sourced version of the same conclusion the sibling practice on keeping always-loaded instructions minimal reaches for one specific file: that practice is about what belongs in an always-loaded CLAUDE.md; this one is about context loaded through any channel, in any tool, supported by evidence that holds across 18 different models rather than one vendor's own guidance.

## When it applies

Applies to any decision about how much to load into a model's context — conversation history, retrieved documents, tool output, or an instruction file — regardless of whether the total stays well under the window's rated limit. It does not apply to deciding whether a single piece of content is relevant enough to include at all; that is a separate judgment this practice doesn't settle, only the cost side of the trade-off once something is judged relevant. It also does not resolve itself by summarizing or chunking long content instead of trimming it: a summary is shorter, but the summarizing step has its own error rate, and this practice offers no evidence about whether that trade is a net improvement.
