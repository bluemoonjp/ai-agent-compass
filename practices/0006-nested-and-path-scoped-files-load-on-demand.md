---
id: "0006"
title: Nested CLAUDE.md and path-scoped rules load on demand, not at launch
status: active
topic: instruction-files
applies_to:
  - claude-code
rule: A CLAUDE.md in a subdirectory, or a .claude/rules/ file with paths frontmatter, loads only when Claude reads a matching file, not at session start; use it for directory- or path-specific instructions.
license: CC-BY-4.0
sources:
  - url: https://docs.claude.com/en/docs/claude-code/memory
    kind: primary
    confidence: verified
    verified_on: "2026-09-19"
    summary: Claude Code's memory documentation states that a CLAUDE.md file in a subdirectory does not load at session start; it loads only when Claude reads a file in that subdirectory, unlike the root file, which loads at launch.
    quote: "Files in subdirectories load on demand when Claude reads files in those directories."
  - url: https://docs.claude.com/en/docs/claude-code/memory
    kind: primary
    confidence: verified
    verified_on: "2026-09-19"
    summary: The same documentation states that a .claude/rules/ file scoped with paths frontmatter loads only when Claude reads a file matching the pattern, not on every tool use, unlike an unscoped rule, which loads at launch.
    quote: "Path-scoped rules trigger when Claude reads files matching the pattern, not on every tool use."
  - url: https://learn.chatgpt.com/docs/agent-configuration/agents-md.md
    kind: primary
    confidence: verified
    verified_on: "2026-09-19"
    summary: OpenAI's Codex documentation states that Codex concatenates every discovered AGENTS.md file into one combined prompt and stops adding files once the total reaches a configurable byte limit, 32 KiB by default, unlike Claude Code's per-directory on-demand loading.
    quote: "Codex skips empty files and stops adding files once the combined size reaches the limit defined by `project_doc_max_bytes` (32 KiB by default)."
---

## Why

Root CLAUDE.md and an unscoped `.claude/rules/` file load at launch into every session, whether or not the current task touches what they describe. A nested CLAUDE.md and a `paths`-scoped rule instead wait until Claude actually reads a file the rule concerns, so guidance narrow enough to belong to one directory or file type stays out of context until it's relevant, rather than being paid for on every turn regardless of task.

## When it applies

Applies to deciding where to put directory- or file-type-specific guidance in a Claude Code project: a subdirectory's own CLAUDE.md, or a `.claude/rules/*.md` file carrying `paths` frontmatter. It does not apply to guidance every session needs regardless of which files get touched — that belongs in the root CLAUDE.md or an unscoped rule, both of which load at launch alongside it. It also does not apply to guidance whose trigger isn't a file read at all: the load happens when Claude reads a matching file, not when it runs a command or writes a new file in that directory, so a rule that must fire on those actions still needs to live somewhere loaded unconditionally.

## Conflicting guidance

Claude Code loads each nested or path-scoped file individually, on demand, as Claude reads a matching file. Codex's AGENTS.md discovery works differently: it concatenates every AGENTS.md file it finds, from the project root down, into one combined prompt, and stops adding files once that combination reaches a byte limit that defaults to 32 KiB. A project that nests instructions several directories deep under the assumption that Claude Code's on-demand model applies everywhere will find that Codex, instead, can silently drop whichever files the traversal hadn't reached yet once the cap is hit, unless the limit is raised.
