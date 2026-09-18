# ADR-0007: bloated-agents-md's llm graders need claude-sonnet-5, not the default haiku

Status: accepted

Issue: #74

Date: 2026-09-19

## Context

The `bloated-agents-md` eval case's `llm` graders (`expected-outcomes`, `no-both-sides`) exist to catch a regression in what the `compass-instruction-file` skill recommends. `claude plugin eval` defaults `--judge-model` to `haiku`. A single-run baseline against the original graders scored the correctly-triaged `with`-arm response 0 (`judge votes: FAIL FAIL FAIL`) — every stated outcome was met and cited the right practice/antipattern ids, so this was a false negative, not a real regression. Two different explanations compete for that result: the graders' own wording (both contain a `FAIL if ...` clause a judge's reasoning could echo back and trip a naive "no FAIL token anywhere" vote parser), or the judge model itself being unreliable for a multi-part, id-citation-checking criteria at this size.

A `--runs 3`, 2×2 comparison ({original criteria, a judgment-word-free rewrite of both `llm` graders} × {`haiku`, `claude-sonnet-5`}) separated the two: `claude-sonnet-5` graded all 6 `with`-arm and all 6 `without`-arm runs correctly under the *original*, unmodified criteria — no rewrite needed. `haiku`, under that same original criteria, produced both a false positive (passed a `without`-arm response that never cited an antipattern id and kept the very section the criteria required deleted) and, in the rewritten-criteria cell, a false negative on 3/3 `with`-arm responses that each met every criterion cleanly. Criteria wording did not track with accuracy in either direction; judge model did. The judgment-word-free grader rewrite was a throwaway comparison artifact, not committed.

Separately, `case.yaml`'s `context.add_dirs` was tested directly and rejects any path that escapes the case's own directory — it cannot grant the `with` arm read access to a sibling `plugins/*/skills/*/references/` directory without duplicating that content into the eval case itself, and the `with`-arm's blocked reads are also independently subject to the sandbox's own tool-permission mode, not only a working-directory boundary `add_dirs` could address even if it could reach outside the case directory.

## Decision

`docs/maintain/release.md`'s eval-suite command specifies `--judge-model claude-sonnet-5` explicitly rather than relying on the `haiku` default. The graders themselves are unchanged.

`bloated-agents-md/prompt.md`'s `runs` is raised from 1 to 3, since a single run cannot distinguish a genuine grading problem from the sampling noise that made this bug hard to reproduce in the first place. This applies specifically to eval cases using an `llm` grader; `claude-md-design` and `unrelated-task` use only `tool_used` graders (deterministic pattern matching, no judge model involved) and are unaffected by this decision.

The `with`-arm's inability to read the skill's own `references/` material past the sandbox is recorded here as a known, currently-unresolved gap between what this eval exercises and what the skill's full reference text provides, rather than left undocumented.

## Consequences

Grading `bloated-agents-md` costs more per run (`claude-sonnet-5` judge calls run roughly 2.5× `haiku`'s cost per vote in this comparison, ~$0.09 total across 6 with-arm + 6 without-arm runs at `--runs 3`) in exchange for a judge that graded all 12 runs in this comparison correctly against 0 confirmed grading errors, versus `haiku`'s observed false positive and false negative on the same, unmodified criteria.

This decision is worth revisiting if a future `--runs 3` `claude-sonnet-5`-judged run reproduces a grading error on this case, if `claude plugin eval` changes its default judge model, or if `case.yaml`'s `context.add_dirs` schema changes to allow a path outside the case's own directory (which would remove the `references/` access gap noted above without duplicating content).
