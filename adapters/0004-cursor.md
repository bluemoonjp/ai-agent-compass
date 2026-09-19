---
id: "0004"
title: "Cursor: one rule file format spans four attachment modes; AGENTS.md is a separate, simpler path"
status: active
topic: instruction-files
applies_to:
  - cursor
rule: A Cursor .mdc rule's attachment mode (always, description-triggered, glob-triggered, or mention-only) is set by three frontmatter fields on the file, not by where it lives.
license: CC-BY-4.0
sources:
  - url: https://cursor.com/docs/rules.md
    kind: primary
    confidence: verified
    verified_on: "2026-09-19"
    summary: Cursor's own documentation describes four rule types controlled from a type dropdown that sets the description, globs, and alwaysApply frontmatter fields, ranging from always-applied to manually mentioned.
    quote: "Always Apply: Apply to every chat session. Apply Intelligently: When Agent decides it's relevant based on description. Apply to Specific Files: When file matches a specified pattern. Apply Manually: When @-mentioned in chat"
  - url: https://cursor.com/docs/rules.md
    kind: primary
    confidence: verified
    verified_on: "2026-09-19"
    summary: The same documentation states Cursor also supports AGENTS.md as a plain-markdown alternative to structured project rules, placed in the project root or any subdirectory.
    quote: "Cursor supports AGENTS.md in the project root and subdirectories."
  - url: https://cursor.com/docs/rules.md
    kind: primary
    confidence: verified
    verified_on: "2026-09-19"
    summary: The same documentation states that instructions from a nested AGENTS.md file are combined with those from its parent directories, with the more specific file's instructions taking precedence over the broader one's.
    quote: "Instructions from nested `AGENTS.md` files are combined with parent directories, with more specific instructions taking precedence."
---

## Why

Cursor's `.cursor/rules/*.mdc` files are one format serving four different attachment modes, selected by how three frontmatter fields — `alwaysApply`, `description`, and `globs` — are set together on that same file, rather than by separate mechanisms for each mode: `alwaysApply: true` makes a rule load into every chat session regardless of the other two fields; `false` with `globs` set auto-attaches the rule when a matching file is already in context; `false` with only `description` set lets the agent decide relevance from that description and pull the rule in; and `false` with neither set means the rule loads only when a person `@`-mentions it directly. Cursor separately supports `AGENTS.md` as a plain-markdown file with none of that frontmatter, nestable in the project root and any subdirectory, where instructions from a nested file combine with its parent directories' and a more specific file takes precedence over a broader one.

| Moves to other tools | Stays Cursor-specific (numbers, event names, config keys) |
| --- | --- |
| An agent can decide whether a piece of guidance is relevant from a short description, instead of that guidance being unconditionally loaded or requiring an exact path match | The `.mdc` extension and the specific `alwaysApply`/`description`/`globs` field combinations that select each of the four modes |
| Whether a more specific, nested instruction file outranks a broader one is a tool-specific design choice, not something to assume either way | Cursor's own stated choice, for `AGENTS.md` specifically: nested files combine with their parents, and the more specific one takes precedence |

## When it applies

Applies to choosing which of the four `.mdc` attachment modes fits a given piece of Cursor guidance, and to deciding whether a project needs the structured `.cursor/rules/` format at all versus a plain nested `AGENTS.md`. It does not apply to a `.cursor/rules` file with no frontmatter — a plain `.md` file placed there is ignored by the rules system entirely, since it has no `description`, `globs`, or `alwaysApply` for Cursor to read. It also does not resolve a conflict between the two mechanisms when a project uses both: an `.mdc` rule's attachment is governed by its own frontmatter, independent of where it lives, while a nested `AGENTS.md`'s precedence is governed by directory position — nothing in this documentation states which one wins if a `.mdc` rule and an `AGENTS.md` file disagree on the same point.
