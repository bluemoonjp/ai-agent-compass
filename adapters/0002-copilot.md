---
id: "0002"
title: "Copilot: which custom-instruction type applies depends on the surface, not just the repository"
status: active
topic: instruction-files
applies_to:
  - copilot
rule: Copilot ranks agent instructions below repository-wide and path-specific instructions, and which surfaces honor agent instructions at all varies; an AGENTS.md may be outranked or skipped.
license: CC-BY-4.0
sources:
  - url: https://docs.github.com/en/copilot/concepts/prompting/response-customization
    kind: primary
    confidence: verified
    verified_on: "2026-09-19"
    summary: GitHub's own documentation states that agent instructions, specified in AGENTS.md, CLAUDE.md, or GEMINI.md files, are similar to repository-wide custom instructions but are not currently supported by every Copilot feature.
    quote: "Agent instructions, which are similar to repository-wide custom instructions, but are currently not supported by all Copilot features."
  - url: https://docs.github.com/en/copilot/concepts/prompting/response-customization
    kind: primary
    confidence: verified
    verified_on: "2026-09-19"
    summary: GitHub's own documentation gives the complete precedence order when several instruction types apply to one request, personal first (not shown in this quote), then path-specific, then repository-wide, then agent instructions, then organization instructions last.
    quote: "Repository custom instructions: Path-specific instructions in any applicable .github/instructions/**/*.instructions.md file Repository-wide instructions in the .github/copilot-instructions.md file Agent instructions (for example, in an AGENTS.md file) Organization custom instructions"
  - url: https://docs.github.com/en/copilot/reference/custom-instructions-support
    kind: primary
    confidence: verified
    verified_on: "2026-09-19"
    summary: GitHub's own support reference shows Copilot Chat on GitHub.com lacking an agent-instructions row entirely, unlike Copilot Chat in Visual Studio Code, whose row includes agent instructions using an AGENTS.md file.
    quote: "Copilot Chat Personal instructions. Repository-wide instructions (using the .github/copilot-instructions.md file). Organization instructions."
---

## Why

Copilot recognizes personal, organization, and repository custom instructions, and splits the repository tier itself into three: path-specific (`.github/instructions/**/*.instructions.md`), repository-wide (`.github/copilot-instructions.md`), and agent instructions (`AGENTS.md`, `CLAUDE.md`, or `GEMINI.md`). When several apply to one request, GitHub's own documentation gives a complete order: personal first, then path-specific, then repository-wide, then agent instructions, then organization last — meaning `AGENTS.md` is not just one of several equal repository-level sources, it is explicitly the lowest-ranked one within that tier, outranked by both `.github/copilot-instructions.md` and any matching path-specific file. GitHub's own documentation is separately explicit that agent instructions specifically are "not currently supported by all Copilot features": its own support-reference page shows Copilot Chat on GitHub.com's row listing only personal, repository-wide, and organization instructions, with no agent-instructions entry at all, while the same feature's row for Visual Studio Code does include agent instructions through an `AGENTS.md` file. A project's `AGENTS.md` is not silently reformatted or ignored everywhere — on some surfaces it is outranked by other files that also apply, and on others it is entirely absent from the request, and which of those happens depends on which surface handled that particular request.

| Moves to other tools | Stays Copilot-specific (numbers, event names, config keys) |
| --- | --- |
| A single instruction file's applicability, and its rank relative to other instruction files, can depend on which product surface is actually handling the request, not just on whether the file exists in the repository | The specific instruction hierarchy (personal / organization / repository, with repository split into path-specific / repository-wide / agent) and the `.github/copilot-instructions.md` and `.github/instructions/**/*.instructions.md` paths |
| A more specific, narrower-scoped instruction outranks a broader one when both apply | The exact ranking personal > path-specific > repository-wide > agent instructions > organization |

## When it applies

Applies to deciding whether an `AGENTS.md` alone is sufficient for a Copilot-based project, or whether the same guidance also needs a `.github/copilot-instructions.md` for surfaces that don't read agent instructions at all. It also applies to a surface that honors both: since `.github/copilot-instructions.md` outranks `AGENTS.md` there, guidance that must win should live in the repository-wide file, not the agent-instructions file, on any surface where both are read. It does not apply to a project that only ever uses a single Copilot surface confirmed to support agent instructions and to have no repository-wide file that could outrank it, where neither gap this practice describes has a chance to bite.
