---
id: "0013"
title: Only files loaded unconditionally at launch are guaranteed to survive compaction
status: active
topic: context
applies_to:
  - claude-code
rule: After /compact, the project-root CLAUDE.md and unscoped rules re-inject from disk; a nested CLAUDE.md or path-scoped rule reloads only when its trigger fires again; a conversation-only note does not.
license: CC-BY-4.0
sources:
  - url: https://docs.claude.com/en/docs/claude-code/memory
    kind: primary
    confidence: verified
    verified_on: "2026-10-05"
    summary: Claude Code's memory documentation states that a project-root CLAUDE.md survives compaction because Claude re-reads it from disk and re-injects it into the session after /compact runs.
    quote: "Project-root CLAUDE.md survives compaction: after /compact, Claude re-reads it from disk and re-injects it into the session."
  - url: https://docs.claude.com/en/docs/claude-code/memory
    kind: primary
    confidence: verified
    verified_on: "2026-10-05"
    summary: The same documentation states that a nested CLAUDE.md or a paths-scoped rule instead reloads only when Claude reads a file it applies to, not automatically alongside the root file after compaction.
    quote: "Nested CLAUDE.md files in subdirectories and rules with paths: frontmatter reload as Claude reads files they apply to."
  - url: https://docs.claude.com/en/docs/claude-code/memory
    kind: primary
    confidence: verified
    verified_on: "2026-10-05"
    summary: The same documentation states that an instruction missing after compaction was either given only in conversation, lives in a nested CLAUDE.md that hasn't reloaded yet, or is a path-scoped rule that hasn't matched a file since.
    quote: "If an instruction disappeared after compaction, it was given only in conversation, lives in a nested CLAUDE.md that hasn't reloaded yet, or is a path-scoped rule that hasn't matched a file since."
  - url: https://docs.claude.com/en/docs/claude-code/context-window
    kind: primary
    confidence: verified
    verified_on: "2026-10-05"
    summary: Claude Code's context-window documentation lists, in its table of what survives compaction, the project-root CLAUDE.md together with unscoped rules as re-injected from disk after compaction.
    quote: "Project-root CLAUDE.md and unscoped rules Re-injected from disk"
  - url: https://docs.claude.com/en/docs/claude-code/context-window
    kind: primary
    confidence: verified
    verified_on: "2026-10-05"
    summary: The same documentation states that path-scoped rules and nested CLAUDE.md files enter message history when Claude reads, writes, or edits their trigger file, so compaction summarizes them away like any other conversation content.
    quote: "Path-scoped rules and nested CLAUDE.md files load into message history when Claude reads, writes, or edits their trigger file, so compaction summarizes them away with everything else."
---

## Why

`/compact` discards the conversation it summarizes, and what reappears afterward depends on how each piece of context got there in the first place. The root CLAUDE.md and unscoped `.claude/rules/` files are re-read from disk and re-injected automatically, so they survive compaction the same way they survived session start. A nested CLAUDE.md or a `paths`-scoped rule was never loaded unconditionally to begin with — it appeared because Claude read a matching file — so after compaction it stays absent until that same trigger fires again. An instruction that only ever existed as something typed mid-conversation has no file to re-read from and does not come back at all.

## When it applies

Applies to deciding whether an instruction needs to survive a long session that may eventually compact, including deciding where to put something currently sitting only in conversation. It does not apply within a single, uncompacted session, where a nested file or a path-scoped rule that already triggered once behaves the same as any other loaded context until compaction actually happens. The guarantee this practice states covers what the cited documentation names: a project-root CLAUDE.md and unscoped rules. It does not confirm whether an `@`-imported file or a user-level global CLAUDE.md shares the same guarantee, even though each of those also loads unconditionally at session start — treat that as an open question the cited sources don't settle, not as something this practice extends to them.
