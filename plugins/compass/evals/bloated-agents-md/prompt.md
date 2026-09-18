---
name: bloated-agents-md
description: A bloated AGENTS.md with a repository-overview section, heavy emphasis, and a contradictory rule; the skill should fire and give a single triaged recommendation per line.
tags: [smoke, positive]
runs: 1
---

Our project's `AGENTS.md` has grown unwieldy. Here is its current content:

```markdown
# AGENTS.md

## Repository overview

This repository is a TypeScript monorepo with three packages: `api`, `web`,
and `shared`. The `api` package exposes a REST API built on Express. The
`web` package is a React frontend built with Vite. The `shared` package
holds types and utilities used by both.

## IMPORTANT rules

- **IMPORTANT**: Always run `npm test` before committing.
- **IMPORTANT**: Always use TypeScript strict mode.
- **IMPORTANT**: Always write a commit message that starts with a ticket
  number.
- **IMPORTANT**: Prefer functional components in `web`.
- **IMPORTANT**: Never commit directly to `main`.

## Style

- Use 2-space indentation everywhere.
- Use 4-space indentation for Python scripts under `scripts/`.
```

Help me decide what to keep, what to delete, and what should become a hook
or a CI check instead, and propose a replacement `AGENTS.md`.
