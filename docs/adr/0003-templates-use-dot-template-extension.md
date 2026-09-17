# ADR-0003: Templates use a .template extension to avoid agent discovery

Status: accepted

Issue: #13
Date: 2026-09-17

## Context

`templates/AGENTS.md.template` (added by a later issue) is a starter file for another project, not an instruction for an agent working on this one. But a raw `templates/AGENTS.md` would itself be discovered: nested `CLAUDE.md` and nested skills are officially supported by Claude Code, and Copilot picks up any `AGENTS.md` it finds regardless of location. A template that lives under this repository's own working tree is a live instruction file the moment an agent's discovery walk reaches it.

## Decision

Every filename this repository treats as a live instruction file for some agent (`CLAUDE.md`, `AGENTS.md`, `SKILL.md`, `GEMINI.md`, `.cursorrules`, `*.mdc`, `copilot-instructions.md`, `.windsurfrules`, `CONVENTIONS.md`, and anything under `.claude/`, `.github/{instructions,prompts,agents}/`, `.gemini/`, `.codex/`, `.cursor/`) must, outside a fixed allowlist, never appear at that exact name in this repository. A template stored under `templates/` uses a `.template` suffix (`templates/AGENTS.md.template`, not `templates/AGENTS.md`), which changes its filename enough that no agent's discovery rule matches it. The check `no-live-instruction-files` enforces this for every tracked path.

Alternatives considered and rejected:

- **Fenced code block inside a Markdown doc.** Loses a real, diffable, lintable file; template drift is caught only by eye.
- **An `_templates/` directory.** Directory names carry no meaning to an agent's discovery walk; `_templates/AGENTS.md` is still named `AGENTS.md`.
- **`.gitignore`-ing the raw template names.** Discovery walks the working tree, not the git index; an untracked `AGENTS.md` still fires for an agent reading the filesystem.
- **A `claudeMdExcludes`-style config.** Narrows the hole for one agent's one setting; every other agent (and any future Claude Code default) still discovers the raw file.
- **An `examples/` directory holding a full copy of the repo layout.** Doubles the maintenance surface (two copies to keep in sync) without removing the discoverable filename it holds.

Revisit this decision if an agent's discovery rule changes such that filename alone stops being sufficient — for example, if a tool starts scoping discovery to a declared root and ignoring nested copies regardless of name.

## Consequences

The check can enumerate every tracked path once and decide list membership; no per-tool cooperation is required, and the same rule holds even for agents this repository has not been tested against. The cost is that every genuinely live root file (`AGENTS.md`, `CLAUDE.md`, `.claude/settings.json`, and each plugin's `SKILL.md`) must be named explicitly in the check's allowlist, which is one more place to update when a new one is added.
