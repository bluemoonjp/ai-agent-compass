---
name: review-existing-agents-md
description: An existing AGENTS.md pasted for a compliance audit against sourced best practices, mixing a followed practice with two antipatterns; the skill should fire and judge each applicable practice or antipattern as followed, violated, or not applicable, citing ids and sources.
tags: [smoke, positive]
runs: 3
---

We already have an `AGENTS.md` in production. Please audit it against your best-practices guidance and tell me which parts comply and which don't, citing whatever you're basing each judgment on.

```markdown
# AGENTS.md

## Repository overview

This is a Node.js monorepo with an `api` package (Express REST API) and a
`web` package (React frontend built with Vite).

## Rules

- **IMPORTANT**: Always run `npm test` before committing.
- **IMPORTANT**: Use TypeScript strict mode everywhere.
- **IMPORTANT**: Write commit messages starting with a ticket number.
- Prefer functional components in `web`.
```

Don't rewrite the file yet — just tell me what's compliant and what isn't, and why.
