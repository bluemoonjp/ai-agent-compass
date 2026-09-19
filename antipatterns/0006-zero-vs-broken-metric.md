---
id: "0006"
title: A metric that reads the same whether nothing happened or collection broke
status: active
topic: instruction-files
applies_to:
  - general
rule: Do not design a count that reports the same "zero" result whether the thing measured genuinely didn't happen or the collection mechanism itself failed; make the two distinguishable.
license: CC-BY-4.0
classification: harmful
relates_to:
  - "0011"
sources:
  - url: https://grafana.com/docs/grafana/latest/alerting/guides/missing-data/
    kind: primary
    confidence: verified
    verified_on: "2026-09-19"
    summary: Grafana's own alerting documentation states that Prometheus-style alerting does not fire when a query returns no data, treating an empty result the same as a genuinely healthy state, so a target that stops reporting entirely triggers no alert unless someone explicitly checks for the absence.
    quote: "Prometheus doesn't fire alerts when the query returns no data. It simply assumes there was nothing to report, like with query errors. Missing data won't trigger existing alerts unless you explicitly check for it."
---

## Symptom

A count, a check-run result, or a status field reads "0" or "none" both on a day everything genuinely worked and on a day the thing that was supposed to produce the count silently failed to run at all.

## Cause

A count of zero is the expected, healthy value for most metrics most of the time, so it's tempting to treat "nothing reported" and "nothing to report" as the same signal. Building the distinction takes an explicit second check — confirming the collector itself ran — which is easy to skip when the common case looks fine either way.

## Remedy

Design the metric or check so a broken collector produces a visibly different signal than a genuinely clean run — a missing-data state, a heartbeat that itself gets checked, or a distinct error value instead of the same zero. Grafana's own alerting documentation names this exact failure mode for monitoring systems: Prometheus-style alerting treats an absent query result the same as a query that legitimately found nothing, so a target that stops reporting entirely raises no alarm unless something explicitly checks for the absence itself. The distinguisher doesn't have to live inside the metric itself — a collector that exits non-zero and reddens its own CI job already separates "genuinely zero" from "collection broke" through a different channel, and a plain zero count is harmless once something else has ruled out the second case. The same ambiguity shows up outside monitoring, in the sibling practice on hook exit codes: a hook's silence doesn't settle whether it ran and declined to act or never ran at all, which is exactly why that practice argues for a mechanism that reports its own outcome rather than trusting an absence of signal to mean anything on its own.
