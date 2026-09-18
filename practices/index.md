# Practice index

Generated from `practices/*.md` by `pnpm gen`; do not edit.

| ID | Rule | Topic | Applies to | Verified on |
| --- | --- | --- | --- | --- |
| 0001 | Keep CLAUDE.md and AGENTS.md minimal; convert anything that must happen every time with zero exceptions into a hook instead of prose. | instruction-files | claude-code | 2026-09-17 |
| 0002 | Keep README.md focused on humans (quick starts, project descriptions, contribution guidelines) and put agent-specific context in AGENTS.md instead. | docs | general | 2026-09-17 |
| 0003 | An @path import in CLAUDE.md is expanded into context at launch alongside the file that references it; it does not load lazily when the agent later needs it. | instruction-files | claude-code | 2026-09-19 |
| 0004 | Write and maintain one canonical rule per topic; remove any instruction that contradicts another instead of leaving the agent to pick one. | instruction-files | claude-code | 2026-09-18 |
| 0005 | Keep a skill's name and description as the only startup-loaded metadata, its body loaded on demand, and reference files linked no more than one level deep from SKILL.md. | instruction-files | claude-code, general | 2026-09-18 |

This table's content is drawn from `practices/`, licensed under [CC BY 4.0](../LICENSE-DOCS).
