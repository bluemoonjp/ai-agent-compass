---
id: "0007"
title: Personal- and project-level instructions rank in opposite orders across tools
status: active
topic: instruction-files
applies_to:
  - general
rule: Do not assume a personal- or user-level instruction file automatically overrides a project-level one, or the reverse; confirm the specific tool's precedence before relying on it.
license: CC-BY-4.0
sources:
  - url: https://docs.claude.com/en/docs/claude-code/memory
    kind: primary
    confidence: verified
    verified_on: "2026-09-19"
    summary: Claude Code's memory documentation states that user-level rules under ~/.claude/rules/ load before project-level rules, giving the project-level rules higher priority when both apply.
    quote: "User-level rules are loaded before project rules, giving project rules higher priority."
  - url: https://docs.github.com/en/copilot/concepts/prompting/response-customization
    kind: primary
    confidence: verified
    verified_on: "2026-09-19"
    summary: GitHub's Copilot documentation states the opposite ordering for the analogous layers, personal instructions rank above repository instructions, which in turn rank above organization instructions.
    quote: "Personal instructions take the highest priority. Repository instructions come next, and then organization instructions are prioritized last."
---

## Why

An instruction meant to be authoritative at one layer only works as intended if the author knows which layer wins when a personal- or user-scoped instruction and a project- or repository-scoped one disagree, and that ranking is not a shared convention — it's a design choice each tool states in its own documentation, and the two tools covered here state opposite choices.

## When it applies

Applies whenever a personal- or user-scoped instruction and a project- or repository-scoped instruction could plausibly say different things about the same situation, in any tool that supports both layers. It does not apply to two instructions at the same layer that merely overlap without disagreeing, since both can simply hold at once there. It also does not settle whether either layer is actually followed on a given turn — confirming which layer ranks higher tells an author which text the tool positions as more authoritative, not that either is guaranteed to be honored.

## Conflicting guidance

Claude Code's own documentation states that a user-level rule loads before a project-level rule, and that the project-level rule accordingly has higher priority. GitHub's own documentation of Copilot states the reverse ordering for the layers Copilot recognizes: a personal instruction takes the highest priority, ahead of a repository instruction, which in turn ranks above an organization instruction. An author who writes a personal-level override in one tool and assumes the same ranking carries over to the other will have it silently backwards. This load-order ranking between layers is a different question from what happens when two rules within a resolved context genuinely disagree in meaning, where the sibling practice on writing one canonical rule applies instead and no such ordering is promised.
