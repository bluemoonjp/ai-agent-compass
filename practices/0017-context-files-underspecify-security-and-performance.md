---
id: "0017"
title: Context files specify functional detail far more than security or performance
status: active
topic: evidence
applies_to:
  - general
rule: Do not assume a context file covers non-functional requirements just because it covers functional ones; a study found security/performance guidance in roughly 1 in 7 files, versus most for tests.
license: CC-BY-4.0
sources:
  - url: https://arxiv.org/abs/2511.12884
    kind: research
    confidence: verified
    verified_on: "2026-09-19"
    summary: A content analysis of 2,303 agent context files from 1,925 repositories, across 16 instruction types, found developers prioritize functional context such as test procedures (75.9%) and implementation details (70.8%), while security (14.8%) and performance (14.5%) are rarely specified.
    quote: "developers prioritize functional context, such as test procedures (75.9%), implementation details (70.8%), and architecture (68.1%). We also identify a significant gap: non-functional requirements such as security (14.8%) and performance (14.5%) are rarely specified"
---

## Why

A context file that thoroughly documents how to run tests and where the architecture lives can still say nothing about what the agent must never do to the security posture or the performance budget, and a large-scale content analysis of 2,303 agent context files across 1,925 repositories found exactly that split: test procedures and implementation detail each appear in roughly seven or eight files out of ten, while security and performance guidance each appear in roughly one file out of seven. A file that looks comprehensive because it covers the functional categories well may simply never have been checked against the non-functional ones.

## When it applies

Applies to auditing an existing context file for gaps, or to drafting a checklist of instruction categories before writing one from scratch — security and performance deserve deliberate inclusion rather than an assumption that thorough functional coverage already implies they're addressed. It does not apply to every project equally; a project with no meaningful security surface or performance budget has nothing to lose by the gap this study measured, and forcing a security or performance section into such a file would be padding, not coverage. It also does not apply where security or performance is already enforced through a mechanism outside the context file's prose — a required CI check, a linter, or a linked security policy — since the study measured what a context file's own text specifies, not whether a project addresses these requirements at all.
