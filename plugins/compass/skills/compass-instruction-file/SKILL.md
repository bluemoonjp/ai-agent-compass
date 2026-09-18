---
name: compass-instruction-file
description: Use when designing, auditing, or reviewing an instruction file — AGENTS.md, CLAUDE.md, .claude/rules/*, or another tool's equivalent (a Codex AGENTS.md, a Copilot instructions file, a Cursor rules file, a Gemini CLI context file). Decide what belongs in always-loaded prose, what to delete, and what to convert into a hook or a CI check instead.
license: MIT
metadata:
  topics:
    - instruction-files
---

# compass-instruction-file

## Procedure

1. Read `references/instruction-files.md`. It carries every active practice and antipattern this skill's topic covers — id, rule, and the reasoning behind each — generated from this plugin's source of truth.
2. List every instruction file in the target project: `AGENTS.md`, `CLAUDE.md`, `.claude/rules/*`, and any other tool's equivalent. Read each one line by line, or section by section for a long file.
3. Identify which tool the target project's instruction file is actually for (Claude Code, Codex, Copilot, Gemini CLI, Cursor, or general). Where `references/instruction-files.md` lists a practice or antipattern scoped to more than one `applies_to` value, apply only the guidance that matches the target's actual tool; do not present the other tool's guidance as an alternative.
4. For every line or section, choose exactly one outcome and record it:
   - **Delete.** The line restates something obvious from the codebase (practice `0001`), or hedges between two rules instead of stating one (practice `0004`).
   - **Keep as prose.** The line is genuinely conditional or exploratory guidance an agent needs loaded every time, and no deterministic mechanism can enforce it (practice `0001`).
   - **Convert.** The line describes something that must happen every time with zero exceptions — move it into a hook, a lint rule, or a required CI check, and delete the prose (practice `0001`).
5. Check every line kept or rewritten against these rules before proposing it:
   - Does it duplicate content an `@import` already loads eagerly, as if the import deferred loading until needed, or does an import chain exceed the four-hop depth limit (practice `0003`)?
   - Does it leave two rules that could contradict instead of exactly one canonical rule (practice `0004`)?
   - Does it add a repository-overview section a controlled study found unhelpful (antipattern `0001`)?
   - Does it pile `IMPORTANT`-style emphasis onto many lines instead of reserving it for what actually matters (antipattern `0002`)?
   - If the target file is a `SKILL.md`, does its body defer detail into `references/` one level deep, keeping only `name` and `description` as startup-loaded metadata (practice `0005`)?
6. Draft the file using `references/templates/AGENTS.md.template` and `references/templates/CLAUDE.md.template` as the starting shape, not as content to copy verbatim — the target project's own purpose, map, and rules replace the placeholders.
7. Output the triage as a table (line or section → outcome → practice id) followed by the drafted file content. Cite only the practice or antipattern ids listed above; state the rule being applied for the target's actual tool, not why it changed or what another tool's guidance might say instead.
