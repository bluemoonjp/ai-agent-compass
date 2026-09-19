# Practice index

Generated from `practices/*.md` by `pnpm gen`; do not edit.

| ID | Rule | Topic | Applies to | Verified on |
| --- | --- | --- | --- | --- |
| 0001 | Keep CLAUDE.md and AGENTS.md minimal; convert anything that must happen every time with zero exceptions into a hook instead of prose. | instruction-files | claude-code | 2026-09-17 |
| 0002 | Keep README.md focused on humans (quick starts, project descriptions, contribution guidelines) and put agent-specific context in AGENTS.md instead. | docs | general | 2026-09-17 |
| 0003 | An @path import in CLAUDE.md is expanded into context at launch alongside the file that references it; it does not load lazily when the agent later needs it. | instruction-files | claude-code | 2026-09-19 |
| 0004 | Write and maintain one canonical rule per topic; remove any instruction that contradicts another instead of leaving the agent to pick one. | instruction-files | claude-code | 2026-09-18 |
| 0005 | Keep a skill's name and description as the only startup-loaded metadata, its body loaded on demand, and reference files linked no more than one level deep from SKILL.md. | instruction-files | claude-code, general | 2026-09-18 |
| 0006 | A CLAUDE.md in a subdirectory, or a .claude/rules/ file with paths frontmatter, loads only when Claude reads a matching file, not at session start; use it for directory- or path-specific instructions. | instruction-files | claude-code | 2026-09-19 |
| 0007 | Do not assume a personal- or user-level instruction file automatically overrides a project-level one, or the reverse; confirm the specific tool's precedence before relying on it. | instruction-files | general | 2026-09-19 |
| 0008 | Treat instruction files as context with no guarantee of compliance; a requirement that must hold with zero exceptions belongs in a hook, a permission rule, or an external gate such as CI, not prose. | instruction-files | claude-code | 2026-09-19 |
| 0009 | Write a SKILL.md's description in the third person, stating both what the skill does and when to use it; it is the free-text field in what Claude pre-loads before deciding whether to load the skill. | skills | claude-code, general | 2026-09-19 |
| 0010 | Keep each CLAUDE.md file under roughly 200 lines; once it grows past that, move directory- or file-type-specific content into path-scoped rules instead of continuing to grow the always-loaded file. | instruction-files | claude-code | 2026-09-19 |

This table's content is drawn from `practices/`, licensed under [CC BY 4.0](../LICENSE-DOCS).
