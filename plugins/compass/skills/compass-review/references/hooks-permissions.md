# hooks-permissions

Generated from `practices/*.md` and `antipatterns/*.md` by `pnpm gen`; do not edit.

## Practices

### 0011: A hook must exit 2 to block; silence does not mean approval

Rule: For most Claude Code hook events, only exit code 2 blocks the action; exit code 0 or 1 both let it proceed to the normal permission flow, which can still deny it on its own.

Applies to: claude-code

#### Why

A shell script's exit code 1 conventionally signals failure, and it is easy to assume that signaling failure from a `PreToolUse` hook stops the tool call. Claude Code does not read a bare exit 1 that way: for most events, exit code 2 is the only code that blocks through the exit code alone, and 0 or 1 both let the call fall through to the normal permission flow instead. That flow can still deny the call on its own terms, so a hook author who returns 1 on a policy violation has not necessarily approved the action — but they also have not written the deterministic block they may have intended, since nothing about the hook itself stopped the call.

#### When it applies

Applies to writing a Claude Code hook meant to enforce a policy by blocking an action, in particular a `PreToolUse` hook meant to block a tool call — there, exit code 2 is the reliable signal and JSON-free exit 1 is not. It does not apply uniformly across every hook event: whether an event can be blocked at all, and what exit 2 does when it can't, varies per event, since some events represent an action that hasn't happened yet while others represent something already done or already decided. It also does not apply to the worktree events, `WorktreeCreate` and `WorktreeRemove`, where any non-zero exit code — including 1 — does block, unlike the general case this practice describes.

#### Sources

- Claude Code's hooks reference states that exit code 0 with no output means the hook reported no decision, so the tool call falls through to the normal permission flow rather than being approved by the hook's silence. (<https://docs.claude.com/en/docs/claude-code/hooks>)
- The same reference states that, absent valid JSON on stdout, exit code 1 is treated as a non-blocking error rather than the Unix convention of a general failure, and that a hook meant to enforce a policy must use exit code 2 instead. (<https://docs.claude.com/en/docs/claude-code/hooks>)
- The same reference states that exit code 2's effect depends on the event, since some events represent an action that can still be blocked while others represent something that already happened and cannot be prevented. (<https://docs.claude.com/en/docs/claude-code/hooks>)

## Antipatterns

### 0006: A metric that reads the same whether nothing happened or collection broke

Rule: Do not design a count that reports the same "zero" result whether the thing measured genuinely didn't happen or the collection mechanism itself failed; make the two distinguishable.

Classification: harmful

Applies to: general

#### Symptom

A count, a check-run result, or a status field reads "0" or "none" both on a day everything genuinely worked and on a day the thing that was supposed to produce the count silently failed to run at all.

#### Cause

A count of zero is the expected, healthy value for most metrics most of the time, so it's tempting to treat "nothing reported" and "nothing to report" as the same signal. Building the distinction takes an explicit second check — confirming the collector itself ran — which is easy to skip when the common case looks fine either way.

#### Remedy

Design the metric or check so a broken collector produces a visibly different signal than a genuinely clean run — a missing-data state, a heartbeat that itself gets checked, or a distinct error value instead of the same zero. Grafana's own alerting documentation names this exact failure mode for monitoring systems: Prometheus-style alerting treats an absent query result the same as a query that legitimately found nothing, so a target that stops reporting entirely raises no alarm unless something explicitly checks for the absence itself. The distinguisher doesn't have to live inside the metric itself — a collector that exits non-zero and reddens its own CI job already separates "genuinely zero" from "collection broke" through a different channel, and a plain zero count is harmless once something else has ruled out the second case. The same ambiguity shows up outside monitoring, in the sibling practice on hook exit codes: a hook's silence doesn't settle whether it ran and declined to act or never ran at all, which is exactly why that practice argues for a mechanism that reports its own outcome rather than trusting an absence of signal to mean anything on its own.

#### Sources

- Grafana's own alerting documentation states that Prometheus-style alerting does not fire when a query returns no data, treating an empty result the same as a genuinely healthy state, so a target that stops reporting entirely triggers no alert unless someone explicitly checks for the absence. (<https://grafana.com/docs/grafana/latest/alerting/guides/missing-data/>)

This file's content is drawn from `practices/` and `antipatterns/`, licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
