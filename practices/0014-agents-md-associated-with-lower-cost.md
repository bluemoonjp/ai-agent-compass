---
id: "0014"
title: An AGENTS.md file is associated with lower runtime and token cost
status: active
topic: evidence
applies_to:
  - general
rule: Do not assume a repository-level context file only affects correctness; a controlled comparison found its presence associated with lower runtime and token cost, at comparable task completion.
license: CC-BY-4.0
sources:
  - url: https://arxiv.org/abs/2601.20404
    kind: research
    confidence: verified
    verified_on: "2026-09-19"
    summary: A study analyzing 10 repositories and 124 pull requests, run with and without an AGENTS.md file, found its presence associated with a lower median runtime (28.64%) and reduced median output token consumption (16.58%), while task completion behavior stayed comparable.
    quote: "the presence of AGENTS.md is associated with a lower median runtime (Δ28.64%) and reduced output token consumption (Δ16.58%), while maintaining a comparable task completion behavior"
  - url: https://arxiv.org/abs/2601.20404
    kind: research
    confidence: verified
    verified_on: "2026-09-19"
    summary: The same study notes its completion check was a sanity check for non-empty, non-trivial changes rather than a full correctness evaluation, so its efficiency findings should not be read as also proving completion quality was unaffected.
    quote: "this sanity check does not constitute a full correctness evaluation, it provides confidence that the efficiency measurements reported in this paper are not driven by obvious failures"
  - url: https://arxiv.org/abs/2602.11988
    kind: research
    confidence: verified
    verified_on: "2026-09-19"
    summary: A different controlled study, on SWE-bench and a novel CTXbench, found context files did not generally improve task success while raising inference cost, holding for both LLM-generated and developer-committed files, the opposite cost direction from this practice's own source.
    quote: "providing context files does not generally improve task success rates, while increasing inference cost by over 20% on average. This observation holds across different LLMs, coding agents, and for both LLM-generated and developer-committed context files"
---

## Why

It is easy to treat a repository-level context file as a correctness-only lever: it either helps the agent get the task right or it doesn't. Each of 124 real pull request tasks across 10 repositories was executed once with and once without the repository's AGENTS.md file, in matched, isolated environments on the identical pre-merge commit; that paired comparison found AGENTS.md's presence associated with a lower median runtime (28.64%) and lower median output token consumption (16.58%), at comparable task completion. The study is explicit that its completion check was a sanity check for non-empty, non-trivial output rather than a full correctness evaluation — so the finding supports treating AGENTS.md as an efficiency lever worth measuring, not a settled claim that completion quality was unaffected.

## When it applies

Applies to deciding what evidence to look for when justifying a repository-level context file that a maintainer wrote or reviewed: runtime and token cost are outcomes worth measuring alongside correctness, not just correctness alone. It does not apply to a single repository or a small number of runs, where the variance this study's own standard-deviation figures show is large enough that one anecdote could point either way. It also does not apply to a file nobody reviewed — the sibling antipattern on committing an LLM-generated context file without substantial editing describes a case where the file's presence raised cost instead of lowering it, so this practice's benefit presumes the file is one worth having, not merely one that exists.

## Conflicting guidance

This finding and a different controlled study's finding point in opposite directions on cost. This practice's source measured 124 real pull requests on repositories that already had an AGENTS.md file, comparing the same task run with and without it. A separate study, evaluating agents on SWE-bench and a novel benchmark of repositories with developer-committed context files, found context files raised inference cost by more than 20% on average without a general gain in task success — a result it states holds for developer-committed files too, not only LLM-generated ones. The two studies differ in task population and in what "with a context file" means (an established file a real project already uses, versus a file evaluated across held-out benchmark tasks), and neither study explains the other's result; treat the direction of the cost effect as unsettled rather than assuming either finding generalizes to a project this practice's own source didn't measure.
