---
id: "0007"
title: A generated record nothing ever reads back
status: active
topic: instruction-files
applies_to:
  - general
rule: Do not add a log, state file, or exported metric before deciding what will actually consume it; a record with no reader is maintenance cost with no offsetting benefit.
license: CC-BY-4.0
classification: harmful
relates_to:
  - "0001"
sources:
  - url: https://sre.google/workbook/monitoring/
    kind: primary
    confidence: verified
    verified_on: "2026-09-19"
    summary: The Google SRE Workbook's monitoring chapter instructs engineers to resist exporting a metric just because it's easy to generate, and to instead think about how each metric will actually be used before adding it.
    quote: "Each exposed metric should serve a purpose. Resist the temptation of exporting a handful of metrics just because they are easy to generate. Instead, think about how these metrics will be used."
---

## Symptom

A pipeline writes a log file, a state record, or an exported metric that no dashboard displays, no alert reads, no later step in the pipeline consumes, and no one — not even an infrequent human reader such as an on-call engineer during a future incident, or a compliance reviewer — was ever going to read; it exists because writing it looked like good practice, not because any of those readers, automated or human, actually needs it.

## Cause

Emitting a record is cheap and looks like diligence: more logging, more state, more metrics all read as more observability, so it's easy to add one without first confirming who or what will read it back. Nothing forces the check, since the record's absence wouldn't break anything either — the cost is diffuse (a little more to maintain, a little more noise to search through) rather than a failure anyone notices. This is different from a record kept deliberately for a reader who is expected to be rare — a postmortem log meant to sit unread until an incident, or a record kept solely to satisfy a retention requirement — where the absence of daily readers was the plan, not an oversight.

## Remedy

Decide what will consume a record before writing it, not after. The Google SRE Workbook's own monitoring guidance states this directly for metrics: resist exporting one just because it's easy to generate, and think about how it will actually be used first. The same discipline applies to any generated record — a log, a state file, a report — that isn't a metric: if nothing, human or automated, was ever going to read it back, it isn't documentation of anything, it's just another file to keep consistent with a system that has moved on. This is the same "would removing this cause a mistake" test the sibling practice on keeping always-loaded instructions minimal applies to a line of prose, generalized past that practice's own context-budget reasoning to any artifact a project keeps: if no reader was ever decided on, removing the record costs nothing, which is the test for whether it belonged in the first place.
