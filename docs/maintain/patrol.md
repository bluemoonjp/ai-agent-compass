# Patrol

This page is the maintainer's own reference for operating the weekly patrol
(`patrol.yml`) once it is already running. It does not explain how patrol
works internally or why it is shaped the way it is — see ADR-0006 for the
design decisions and `.claude/skills/compass-weekly/SKILL.md` for the
procedure that processes what patrol finds.

## 1. Run patrol manually

```bash
gh workflow run patrol.yml
```

Watch it with `gh run list --workflow patrol.yml -L 1` for the run id, then
`gh run view <run-id>`. A successful run adds one commit to the
`patrol-state` branch (even on a no-op week — `checkedAt` always advances)
and either opens a new `Weekly patrol YYYY-Www` Issue or, if nothing
changed, still closes the previous one and opens a fresh one in its place.

## 2. Re-enable the schedule if GitHub disabled it

GitHub automatically disables a `schedule`-triggered workflow after 60 days
with no repository activity. Re-enable it with:

```bash
gh workflow enable patrol.yml
```

Confirm it took with `gh workflow list` — the workflow's state should read
active, not disabled.

## 3. Whether a patrol-state commit counts as repository activity

Unconfirmed as of this page's last edit. ADR-0006 names this specifically
as a condition that would call its own design back into question: if a
`patrol-state` commit does not count toward the 60-day activity window GitHub
uses to auto-disable a schedule, patrol could go silently disabled between
one maintainer visit and the next. Record what is actually observed here as
it becomes known, rather than assuming either answer.

## 4. What the weekly Issue's content safety actually rests on

`public-surface.yml` triggers on `issues: [opened]`, but GitHub does not
cascade a workflow trigger for an event created by the default
`GITHUB_TOKEN` — the weekly Issue `patrol.yml` opens with `gh issue create`
is exactly that kind of event, so `public-surface.yml` does not scan it.
The only thing standing between a rendered Issue body and a leak is
`scripts/patrol/issue-body.mjs`'s own field-level validation (the same
allowlist-and-throw design as `scripts/patrol/format.mjs`). A change to
either file needs its own manual re-check — render a realistic body locally
and confirm it produces no findings against `forbidden-patterns` — before
merging, the same way that check was done by hand for the PR that first
wired `patrol.yml` up.
