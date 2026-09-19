# ADR-0004: Guard repository operations by operation and endpoint, not HTTP method

Status: accepted

Issue: #53
Date: 2026-09-17

## Context

ADR-0001 narrowed the Claude Code path by adding `gh api -X PUT*`, `gh api -X PATCH*`, and `gh api -X DELETE*` to `.claude/settings.json`'s `permissions.deny`, alongside `gh pr merge`, `gh pr ready`, `gh secret`, `gh release`, `git tag`, and tag pushes. In practice, the `-X PATCH*` rule blocked routine maintenance — editing `required_status_checks` and closing a milestone — that has nothing to do with the trust boundary ADR-0001 was protecting.

Widening the deny list's holes was not the only problem found while investigating the false positive. The same list also fails to stop what it was meant to stop, for several independent reasons:

- Permission rules are evaluated deny, then ask, then allow, and an allow rule cannot carve an exception out of a matching deny rule. This means a deny rule that is too wide cannot be narrowed by adding an allow rule beside it; the deny rule itself has to change.
- Deny rules are namespaced by the tool that produced the invocation. A rule written as `Bash(...)` does not match the same command line issued through a different shell tool, and this environment's default shell is not Bash.
- `gh api` switches its request method to POST automatically once `-f`/`-F` request-parameter flags are present, and does not require an explicit `-X POST`/`--method POST` to do a write. A deny list keyed on `-X PATCH`/`-X PUT`/`-X DELETE` therefore has no rule at all covering the equivalent POST call, and `--method` (the long form of `-X`) was never covered either.
- Those two gaps compose into a bypass: `gh api --method POST` against the releases endpoint or the git refs endpoint produces the same effect as `gh release create` or `git tag`, without matching any existing rule.
- `git tag*` (no space before the `*`) also matches `git tag` with no arguments, which only lists existing tags; a read-only inspection is blocked by a rule meant for tag creation.
- The tag-push rule only matches a command line containing `--tags`; `git push --follow-tags`, which pushes newly created tags reachable from the pushed commits without that flag, is not covered.
- The permissions documentation is explicit that a deny or ask rule covers the invocation an agent usually produces and is not a security boundary around the underlying program. The list was already understood as a mitigation for one cooperating agent, never a sandbox — this investigation only found that even within that narrower goal, it was leaving gaps.

Because the first point rules out layering an allow exception on top of the existing deny rules, the deny rules themselves must be rewritten. Two gaps surfaced while rewriting them, beyond the false positive that started the investigation:

- `gh repo edit`'s visibility flag was not covered at all. ADR-0002 already observes, for a different reason, that a public repository cannot un-publish its history; the same fact makes a visibility change one-way and worth guarding, not left to fall through because it happens to use `PATCH`.
- `gh repo delete` was blocked only by a setting outside this repository (a maintainer-wide default covering every repository the maintainer works on), so this repository's own guard had no effect on its own deletion.

Once the deny rules name operations and endpoints instead of methods, keeping a blanket `-X DELETE*` rule stops making sense: it would block every destructive `gh api` call the same way `-X PATCH*` blocked every routine one, including label and comment deletion that carry no trust-boundary risk. The rules for the specific destructive endpoints (releases, secrets, git refs and tags, pull-request merges, GraphQL) replace it instead.

## Decision

Guard repository operations by naming the operation or the API endpoint it hits, never by the HTTP method alone, and write each rule once per shell tool a Claude Code session can issue it through — today, `Bash(...)` and `PowerShell(...)`; a shell tool added later gets the same rules added in its form when this repository starts relying on it. The guard stays binary — an operation is either denied or allowed — and a confirmation prompt does not count as supervision here: a prompt that gets approved by reflex makes an unreviewed operation look reviewed, which is worse than either extreme. Anyone tempted to reintroduce a middle tier for convenience should read this paragraph first.

This repository does not claim its deny rules cover "every shell" — only the `Bash`/`PowerShell` forms actually written into `.claude/settings.json`, because completeness beyond those two cannot be verified from inside this file.

## Consequences

Editing issues, milestones, labels, and branch-protection settings through `gh api` no longer trips a deny rule, because none of the new rules are keyed on the HTTP method those edits happen to use. Changing repository visibility, deleting the repository, and managing secrets remain blocked for an agent working through the guarded shell tools, whether reached directly or through an equivalent `gh api`/GraphQL call — the same mitigation ADR-0001 established, now harder to route around, still scoped to one cooperating agent. Merging a pull request, publishing a release, and creating or pushing a tag are no longer named in `permissions.deny` (see ADR-0001): they fall through to the auto mode classifier's own soft_deny handling instead, refused by default but reachable once the user names the specific action.

The same file also names, in `permissions.allow`, the day-to-day operations this repository's own working shape requires: its package scripts, `node --test`, branch and worktree creation, pushing that branch, opening a pull request, and commenting on an issue. This is not the middle tier the Decision rules out — each named operation is allowed outright rather than routed to a confirmation prompt, and no allow rule weakens a `permissions.deny` entry, which an allow rule could not do in any case; the exact command forms are written alongside the wildcarded ones because auto mode drops wildcarded package-manager rules on entry and keeps exact ones.

Known limitations, recorded rather than solved:

- A command issued through an unguarded path — a shell tool this repository has not yet added rules for, or a wrapper around one of the guarded binaries — is not covered. This is the same class of limitation ADR-0001 already accepted for direct human or other-agent use of the same commands.
- A `gh api` call that performs a repository deletion cannot be caught with a single endpoint-shaped rule, because `gh api` accepts its endpoint and its flags in either order and this repository has no way to pin that order in a glob. `gh repo delete` itself is covered directly instead.
- The rule guarding GraphQL calls blocks all of them, reads included, because the mutation surface reachable through GraphQL (merge, release, ref creation) does not share a REST-shaped path with the read surface, and a blanket rule was chosen over trying to separate them. This repository uses parent/sub-issue relationships between issues (for example, issue #10's parent is issue #6), and querying that relationship can require GraphQL — so this rule can block a legitimate read, not only a mutation.
- The rule that had guarded release-related `gh api` calls blocked reading releases, not only creating or deleting them, for the same reason; it is no longer in `permissions.deny` (see ADR-0001). #24's release-check does not use `gh api` at all — it reads a `COMPASS_RELEASE_TAG` environment variable instead — so the read/write split this limitation once called for was never needed.
- A tag push naming the ref directly, without a `--tags`/`--follow-tags` flag, was not matched by the push rule that used to be in `permissions.deny`; that rule, along with the tag-creation rule it relied on, is no longer there (see ADR-0001) — tag pushes of every form now fall through to the auto mode classifier's soft_deny handling instead of a client-side rule.
- The repository's tag protection does not cover tag creation. With the client-side rules blocking `git tag` and tag pushes removed from `permissions.deny` (see ADR-0001), tag creation and tag pushes rely solely on the auto mode classifier's soft_deny handling, with no server-side or client-side rule backing it up.
- If the tool-name namespacing produces a startup warning for a rule that does not match a tool this installation recognizes, the response is to record that fact here, not to drop the rule — removing a shell tool's rule because it warns leaves that shell tool's route open.
- `git tag *`'s trailing wildcard used to also match the bare `git tag` (a read-only tag listing), not only `git tag <name>` (creation), because Claude Code's permission-pattern language matches a bare command whenever a rule's only wildcard is a trailing one preceded by a space. That rule is no longer in `permissions.deny` (see ADR-0001), so this particular usability cost no longer applies; the pattern-language behavior it illustrated still holds for any other trailing-wildcard rule in this list.
- A guarded command reached through a global option this repository's rules do not parse — for example running `git tag v1.0.0` as `git -C . tag v1.0.0` — is not matched by that command's rule, because the match is against the literal command-line prefix, not a parsed argument list. This is a general property of every rule in this list, not specific to tags, and is the same class of gap Claude Code's own permissions documentation illustrates for `git push`.
- The rule guarding a `gh api` visibility change matches the literal substring `visibility` anywhere on the command line, for the same reason the release and GraphQL rules are blanket: `gh` exposes GitHub's repository-visibility field under that name across more than one endpoint, and a blanket rule was chosen over trying to enumerate them. This means a `gh api` call that only reads a `visibility` field, on this repository or another GitHub resource, also trips the rule.
