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

1. Run `pnpm patrol:review-list`. It prints, one per line, the id of
   every active practice and every active antipattern (ADR-0012). The
   script only prints ids — no rule text, no prose — so the list can be
   reviewed without reading anything sensitive out of context.
2. Re-verify each id on its own, one at a time and independent of the
   others (an agent per id is fine), against its cited source fetched per
   this repository's own `CLAUDE.md` and what the current model release
   notes say. A verdict is `holds` (the source still supports the file's
   claim and its classification, if any, stands) or it is not. Give every
   verdict, `holds` included, to a separate adversarial reviewer who tries
   to show it is wrong. A person decides only on the verdicts that are not
   `holds` or that the reviewer overturned.
3. Search for new sources, with a searcher per id that is separate from the
   one that re-verified it and never sees its verdict; this may run
   alongside the previous step. The release is only the occasion to search,
   so a candidate need not concern the new model or be recent.
   - A candidate is a `primary` or `research` source the file does not
     already cite. The searcher names the sentence of the file's rule or
     body it bears on and whether it supports, narrows, or contradicts that
     sentence; without a named sentence it is not a candidate. Fetch it per
     this repository's own `CLAUDE.md` and take a verbatim quote as
     `docs/maintain/authoring.md` requires.
   - Give every candidate to a separate reviewer who fetches it again and
     tries to reject it for one of four reasons: the quote is not in the
     fetched text; it duplicates a source the file already cites, the same
     work at another address included; it does not bear on the sentence
     named in the relation named; or it is confounded, meaning its result
     comes from a factor other than the one the sentence concerns.
   - Check the host of each candidate that survives or contradicts, yourself
     and not through an agent: it must be the host of a registered anchor or
     of one of its `covers` entries in `sources/registry.json`. A candidate
     on any other host goes no further, a contradicting one included; the
     registry changes outside this procedure.
   - A candidate that contradicts the file goes to a person with the
     reviewer's opinion, even when the reviewer rejected it, in the same
     round as the verdicts that are not `holds`. The person chooses to
     record it under Conflicting guidance (practices), retire the practice,
     reclassify the antipattern, or not adopt it, and that choice goes into
     the verdict pull request.
   - Record in the tracking issue the conclusion for every id and candidate
     pair, the reason for each rejection or host that was not covered, and
     which ids had no candidate.
   - Apply no verdict until every id's search and review is finished.
4. Apply each verdict:
   - If the rule still holds, update `sources[].verified_on` to today and
     leave the rule text alone.
   - If the underlying limitation is gone, retire the practice following
     `docs/maintain/authoring.md`'s retirement procedure: delete the
     practice file and add an antipattern with `classification: obsolete`
     pointing back at it, rather than editing the practice in place.
   - For an antipattern, if the new evidence changes its classification,
     set it to `harmful`, `obsolete`, or `undetermined` accordingly;
     if it does not, update only `verified_on`. When the classification
     changes, rewrite the body to its heading set, which `authoring.md`
     gives.
5. Add the sources that supported or narrowed a rule and survived review, in
   a second pull request that branches from the verdict changes and leaves
   out any file the verdict pull request retires. `docs/maintain/authoring.md`
   states what a source entry must carry under its sourcing, confidence, and
   verbatim-quote headings. Extend only the body section that holds the
   sentence the source bears on (`Why` or `When it applies` for a
   practice, a section of its current heading set for an antipattern), and
   only as far as the source says; if the rule, title, or classification
   would have to change, hand the candidate to a person instead. Run the
   Output review in `docs/maintain/review.md` on each changed file. The pull
   request body repeats the conclusion for each id and candidate pair it
   adopts.
6. Run `pnpm gen && pnpm test && pnpm check` on each branch, then open its
   pull request like any other change to this repository, the verdict
   pull request first.

## Rehearsal record

Run once against the model this repository's own working sessions use at
the time, before relying on this page for a real model release. Record what
`pnpm patrol:review-list` printed and what each id's judgment was in the
tracking issue, without any path or other private information.