# Model release

This page is the second stage of the two-stage design ADR-0006 sets out: the
weekly patrol (`patrol.yml`, `docs/maintain/patrol.md`) detects that a
registered source changed and opens an Issue; this page is what a maintainer
runs once that Issue's `changed` list names a `whats-new` or `changelog`
source and a human has actually read the release notes and confirmed a
Claude Code model release happened. A byte diff cannot tell the difference
between a model release and any other changelog edit — that judgment is why
this stage stays human-triggered rather than folded into patrol itself.

## When to run this

Start here only after a human has read the weekly patrol Issue's `changed`
list, found `claude-code-whats-new`, `claude-code-docs-changelog`, or
`claude-code-changelog-raw` in it, opened the actual page, and confirmed it
describes a new Claude Code model becoming available — not every change to
those pages is a model release. `/compass-weekly` still processes the Issue
itself (advancing `sources/baseline.json` for whichever sources changed);
this page is a separate pass a maintainer runs alongside it once, triggered
by that confirmation.

## Procedure

1. Run `pnpm patrol:review-list`. It prints, one per line, the id of every
   active practice whose `applies_to` includes `claude-code` (its rule may
   describe a limitation the new model no longer has) and the id of every
   antipattern still classified `undetermined` (the new model may resolve
   the uncertainty). The script only prints ids — no rule text, no prose —
   so the list can be reviewed without reading anything sensitive out of
   context.
2. For each id, re-fetch its cited source per this repository's own
   `CLAUDE.md` — confirming a rule still holds needs the actual current
   text, not a paraphrase of it.
3. Judge each one against what the current model release notes say:
   - If the rule still holds, update `sources[].verified_on` to today and
     leave the rule text alone.
   - If the underlying limitation is gone, retire the practice following
     `docs/maintain/authoring.md`'s retirement procedure: delete the
     practice file and add an antipattern with `classification: obsolete`
     pointing back at it, rather than editing the practice in place.
   - For an `undetermined` antipattern, reclassify it to `harmful` or
     `obsolete` if the new evidence settles it, or leave it `undetermined`
     with an updated `verified_on` if it doesn't.
4. Run `pnpm gen && pnpm test && pnpm check`, then open a pull request like
   any other change to this repository.

## Rehearsal record

Run once against the model this repository's own working sessions use at
the time, before relying on this page for a real model release. Record what
`pnpm patrol:review-list` printed and what each id's judgment was in the
tracking issue, without any path or other private information.
