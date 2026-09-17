# AGENTS.md

Best-practices content for AI coding agents, distilled and kept from rotting; written to be read by an agent working on some other project.

Always-loaded context here is limited to principles and an index; anything longer belongs in a linked document.

## Layers

This repository has two layers (ADR-0001): the deliverable (layer A: `practices/`, `antipatterns/`, `adapters/`, `templates/`, plugin `SKILL.md` files) and this repository's own operation (layer B: this file, `CLAUDE.md`, `.claude/`, `docs/maintain/`). Layer B never restates layer A's content by ID or title.

## Working rules

- Work only through pull requests. (none)
- PR titles match `#N: summary`. (none)
- Run `pnpm check` before opening a PR. (none)
- Regenerate generated files with `pnpm gen`; never hand-edit them. (none)
- Never narrate this repository's own history in prose. (ci: no-history-words)
- Never write filesystem paths, email addresses, or other private information. (ci: forbidden-patterns)
- Cite a source with a summary and a link, not a bare claim. (ci: frontmatter-schema)

Write an ADR only when deleting the decision would let someone repeat the mistake, and re-deciding it would need reconstructing an incident or a long investigation.

## Map

| Path | Contents |
| --- | --- |
| `antipatterns/` | Sourced antipatterns: what to avoid and why |
| `docs/adr/` | Architecture decision records |
| `docs/maintain/` | Maintainer setup instructions |
| `practices/` | Sourced best practices for AI coding agents |
| `schemas/` | JSON Schemas for practice and antipattern frontmatter |
| `scripts/` | The check toolchain: runner, checks, and their fixtures |
