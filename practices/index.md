# Practice index

Generated from `practices/*.md` by `pnpm gen`; do not edit.

| ID | Rule | Topic | Applies to | Verified on |
| --- | --- | --- | --- | --- |
| 0001 | Keep CLAUDE.md and AGENTS.md minimal; convert anything that must happen every time with zero exceptions into a hook instead of prose. | instruction-files | claude-code | 2026-10-05 |
| 0002 | Keep README.md focused on humans (quick starts, project descriptions, contribution guidelines) and put agent-specific context in AGENTS.md instead. | docs | general | 2026-10-05 |
| 0003 | An @path import in CLAUDE.md is expanded into context at launch alongside the file that references it; it does not load lazily when the agent later needs it. | instruction-files | claude-code | 2026-10-05 |
| 0004 | Write and maintain one canonical rule per topic; remove any instruction that contradicts another instead of leaving the agent to pick one. | instruction-files | claude-code | 2026-10-05 |
| 0005 | Keep a skill's name and description as the only startup-loaded metadata, its body loaded on demand, and reference files linked no more than one level deep from SKILL.md. | instruction-files | claude-code, general | 2026-10-05 |
| 0006 | A subdirectory CLAUDE.md, or a .claude/rules/ file with paths frontmatter, loads only when Claude reads, writes, or edits a matching file, not at session start. | instruction-files | claude-code | 2026-10-05 |
| 0007 | Do not assume a personal- or user-level instruction file automatically overrides a project-level one, or the reverse; confirm the specific tool's precedence before relying on it. | instruction-files | general | 2026-10-05 |
| 0008 | Treat instruction files as context with no guarantee of compliance; a requirement that must hold with zero exceptions belongs in a hook, a permission rule, or an external gate such as CI, not prose. | instruction-files | claude-code | 2026-10-05 |
| 0009 | Write a SKILL.md's description in the third person, stating both what the skill does and when to use it; it is the free-text field in what Claude pre-loads before deciding whether to load the skill. | skills | claude-code, general | 2026-10-05 |
| 0010 | Keep each CLAUDE.md file under roughly 200 lines; once it grows past that, move directory- or file-type-specific content into path-scoped rules instead of continuing to grow the always-loaded file. | instruction-files | claude-code | 2026-10-05 |
| 0011 | For most Claude Code hook events, only exit code 2 blocks the action; exit code 0 or 1 both let it proceed to the normal permission flow, which can still deny it on its own. | hooks-permissions | claude-code | 2026-10-05 |
| 0012 | Do not assume a model uses its full context window uniformly; treat added context as a cost that can lower reliability on its own, and keep loaded context small regardless of the window's rated size. | context | general | 2026-10-05 |
| 0013 | After /compact, the project-root CLAUDE.md and unscoped rules re-inject from disk; a nested CLAUDE.md or path-scoped rule reloads only when its trigger fires again; a conversation-only note does not. | context | claude-code | 2026-10-05 |
| 0014 | Do not assume a repository-level context file only affects correctness; a controlled comparison found its presence associated with lower runtime and token cost, at comparable task completion. | evidence | general | 2026-10-05 |
| 0015 | Do not trust an unverified claim that an instruction file's size, position, or structure changes compliance; a factorial study found none of 4 such structural variables had a detectable effect. | verification-review | general | 2026-10-05 |
| 0016 | Do not assume improving repository guidance makes an agent's individual fixes better; one study found it raised coverage with precision unchanged on a capable model, while hurting a weaker model. | evidence | general | 2026-10-05 |
| 0017 | Do not assume a context file covers non-functional requirements just because it covers functional ones; a study found security/performance guidance in roughly 1 in 7 files, versus most for tests. | evidence | general | 2026-10-05 |

This table's content is drawn from `practices/`, licensed under [CC BY 4.0](../LICENSE-DOCS).
