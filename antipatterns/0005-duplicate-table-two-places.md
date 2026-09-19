---
id: "0005"
title: The same reference table hand-maintained in two documents
status: active
topic: instruction-files
applies_to:
  - general
rule: Do not hand-maintain the same table, checklist, or reference list in two separate documents; keep it in one place and generate or reference the second copy from it.
license: CC-BY-4.0
classification: harmful
relates_to:
  - "0004"
sources:
  - url: https://docs.github.com/en/contributing/writing-for-github-docs/creating-reusable-content
    kind: primary
    confidence: verified
    verified_on: "2026-09-19"
    summary: GitHub's own documentation-contribution guide describes a mechanism for storing a repeated paragraph or procedural list once, as a single reusable file, and referencing it from every page that needs it, instead of retyping the same content into each one by hand.
    quote: "Reusables are long strings of reusable text, such as paragraphs or procedural lists, that can be referenced in multiple content files."
---

## Symptom

A checklist, a configuration reference, or a table of commands that must always match appears twice — once in a README or onboarding doc, once in an instruction file — each maintained by hand, with no indication which copy is authoritative.

## Cause

The second copy usually starts as a convenience: someone writing the instruction file wants the same information the README already has, and pasting it in is faster than linking to it or wiring up a generator. Each copy is correct the day it's written; nothing then keeps them in sync when one changes. This is a different situation from two tables that merely look alike today because they track related but independently-governed facts — a "supported" list and a "tested" list can coincide now and still be allowed to diverge later; forcing those into one source would remove a distinction the two tables exist to keep.

## Remedy

Keep the content in one file and have the other reference or generate from it, rather than retype it. GitHub's own documentation-contribution guide describes exactly this mechanism for its own docs: a shared piece of content — explicitly including a procedural list, the same shape as a checklist — is stored once as a reusable and referenced from every page that needs it, instead of copied into each one by hand. The same reasoning that argues for one canonical rule per topic applies to a table that must always agree with its other copy: two hand-maintained copies of one fact aren't a redundancy that's merely wasteful, they're a standing opportunity for one to drift and go uncorrected while the other is updated.
