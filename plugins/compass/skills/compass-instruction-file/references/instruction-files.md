# instruction-files

Generated from `practices/*.md` and `antipatterns/*.md` by `pnpm gen`; do not edit.

## Practices

### 0001: Keep always-loaded instructions minimal

Rule: Keep CLAUDE.md and AGENTS.md minimal; convert anything that must happen every time with zero exceptions into a hook instead of prose.

Applies to: claude-code

#### Why

An always-loaded instruction file competes for context on every turn. Anthropic's own guidance for Claude Code observes that a long `CLAUDE.md` causes the agent to ignore its actual instructions, and separately distinguishes `CLAUDE.md`'s advisory rules from a hook's deterministic guarantee. Together these point at the same fix: keep the always-loaded file to what genuinely needs to be always loaded, and move anything that must happen with zero exceptions into a hook, where the harness enforces it instead of prose merely requesting it.

#### When it applies

Applies to Claude Code's `CLAUDE.md` and, by the same reasoning, to any other tool's always-loaded instruction file paired with an equivalent deterministic mechanism (a pre-commit hook, a linter, a required CI check). It does not apply to guidance that is genuinely conditional or exploratory, since a hook can only enforce a fixed, deterministic action.

#### Sources

- Anthropic's Claude Code best-practices guide recommends keeping CLAUDE.md concise, since a bloated always-loaded file causes Claude to ignore its actual instructions. (<https://www.anthropic.com/engineering/claude-code-best-practices>)
- The same guide distinguishes CLAUDE.md's advisory instructions from hooks, which run deterministically and are guaranteed to happen. (<https://www.anthropic.com/engineering/claude-code-best-practices>)

### 0003: @import does not defer loading

Rule: An @path import in CLAUDE.md is expanded into context at launch alongside the file that references it; it does not load lazily when the agent later needs it.

Applies to: claude-code

#### Why

Claude Code's own memory documentation describes an `@path/to/file` import as text that is expanded and loaded into context at launch, alongside the CLAUDE.md file that references it. Nothing about the import is deferred until the agent needs that file for a specific task; the imported content is already present in context from the first turn, the same as if it had been pasted inline. An import is a way to organize an always-loaded file across multiple files, not a way to make part of it load only when relevant.

#### When it applies

Applies to any `@path/to/file` import inside a CLAUDE.md (or CLAUDE.local.md) file that Claude Code reads, including an import nested inside another imported file, up to the source's documented four-hop depth. It does not apply to a path merely mentioned in backticks, which the same documentation treats as literal text rather than an import, and it makes no claim about how another tool's own include or reference mechanism behaves.

#### Sources

- Claude Code's memory documentation states that @path imports are expanded and loaded into context at launch alongside the referencing CLAUDE.md, not deferred until the agent later needs the imported file. (<https://docs.claude.com/en/docs/claude-code/memory>)
- Claude Code's memory documentation states that imported files may recursively import other files up to a maximum nesting depth of four hops. (<https://docs.claude.com/en/docs/claude-code/memory>)

### 0004: Write one canonical rule; contradictions may be resolved arbitrarily

Rule: Write and maintain one canonical rule per topic; remove any instruction that contradicts another instead of leaving the agent to pick one.

Applies to: claude-code

#### Why

Claude Code's memory documentation offers no tie-breaker for two contradictory rules beyond chance: it states that when two rules contradict each other, Claude may pick one arbitrarily, and it recommends periodically reviewing instruction files to remove the conflict rather than trusting the agent to favor one side consistently. A file with two rules that disagree is not a file with a predictable fallback; its actual behavior on a given task only reveals itself at run time, and can change between sessions.

#### When it applies

Applies to a single instruction file, and to how nested CLAUDE.md files, imports, and `.claude/rules/` entries combine into one context. Restating a rule more forcefully in a second location does not settle which one governs; it creates the exact ambiguity the source describes. It does not apply to two rules that are correctly scoped to disjoint situations, such as a path-specific rule and a general rule that never both fire on the same file, since that is not a contradiction.

#### Conflicting guidance

The two primary sources describe different resolution mechanisms for the same situation: two instructions in scope that disagree. Claude Code's documentation says the outcome is arbitrary. OpenAI's own documentation of Codex's `AGENTS.md` discovery describes a deterministic merge instead: files are concatenated from the project root down, and a file closer to the working directory overrides earlier guidance because it appears later in the combined prompt — position, not chance, decides which side wins there. An author who assumes one tool's mechanism is relying on behavior the other tool does not share. Either way the fix is the same: write one canonical rule per topic instead of depending on how a specific tool breaks the tie.

#### Sources

- Claude Code's memory documentation states that when two CLAUDE.md rules contradict each other, Claude may pick one arbitrarily, and recommends removing the conflict rather than relying on a consistent resolution. (<https://docs.claude.com/en/docs/claude-code/memory>)
- OpenAI's Codex documentation describes a deterministic merge instead of an arbitrary pick, AGENTS.md files concatenate from the project root down, and a file closer to the working directory overrides earlier guidance by position. (<https://developers.openai.com/codex/guides/agents-md>)

### 0005: Progressive disclosure: name and description at startup, body on demand, references one level deep

Rule: Keep a skill's name and description as the only startup-loaded metadata, its body loaded on demand, and reference files linked no more than one level deep from SKILL.md.

Applies to: claude-code, general

#### Why

Anthropic's own description of Agent Skills lays out progressive disclosure as staged, relevance-gated loading: at startup, the agent pre-loads only a skill's `name` and `description` into its system prompt, and loads the skill's full body only once it judges that skill relevant to the current task. A further tier exists for files a `SKILL.md` links out to, and Anthropic's best-practices guidance adds a constraint the first source does not spell out on its own: those reference files should link directly from `SKILL.md`, one level deep, because an agent following a chain of nested references may only partially read a file instead of loading it whole, losing information the author assumed would arrive complete.

#### When it applies

Applies to authoring any `SKILL.md`-based skill for an agent that supports this progressive-disclosure model, and to deciding what belongs in the top-level file versus a linked reference file. It does not apply to content an agent loads eagerly regardless of relevance, such as an always-loaded instruction file, and it does not forbid a skill from bundling many reference files — only from chaining them through each other instead of linking each one directly from `SKILL.md`.

#### Sources

- Anthropic's Agent Skills engineering post describes progressive disclosure, a skill's name and description load into the system prompt at startup, and its full SKILL.md body loads only if Claude judges the skill relevant to the task. (<https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills>)
- Anthropic's Agent Skills best-practices docs recommend keeping reference files one level deep from SKILL.md, since Claude may only partially read a file reached through a chain of nested references. (<https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices>)

### 0006: Nested CLAUDE.md and path-scoped rules load on demand, not at launch

Rule: A CLAUDE.md in a subdirectory, or a .claude/rules/ file with paths frontmatter, loads only when Claude reads a matching file, not at session start; use it for directory- or path-specific instructions.

Applies to: claude-code

#### Why

Root CLAUDE.md and an unscoped `.claude/rules/` file load at launch into every session, whether or not the current task touches what they describe. A nested CLAUDE.md and a `paths`-scoped rule instead wait until Claude actually reads a file the rule concerns, so guidance narrow enough to belong to one directory or file type stays out of context until it's relevant, rather than being paid for on every turn regardless of task.

#### When it applies

Applies to deciding where to put directory- or file-type-specific guidance in a Claude Code project: a subdirectory's own CLAUDE.md, or a `.claude/rules/*.md` file carrying `paths` frontmatter. It does not apply to guidance every session needs regardless of which files get touched — that belongs in the root CLAUDE.md or an unscoped rule, both of which load at launch alongside it. It also does not apply to guidance whose trigger isn't a file read at all: the load happens when Claude reads a matching file, not when it runs a command or writes a new file in that directory, so a rule that must fire on those actions still needs to live somewhere loaded unconditionally.

#### Conflicting guidance

Claude Code loads each nested or path-scoped file individually, on demand, as Claude reads a matching file. Codex's AGENTS.md discovery works differently: it concatenates every AGENTS.md file it finds, from the project root down, into one combined prompt, and stops adding files once that combination reaches a byte limit that defaults to 32 KiB. A project that nests instructions several directories deep under the assumption that Claude Code's on-demand model applies everywhere will find that Codex, instead, can silently drop whichever files the traversal hadn't reached yet once the cap is hit, unless the limit is raised.

#### Sources

- Claude Code's memory documentation states that a CLAUDE.md file in a subdirectory does not load at session start; it loads only when Claude reads a file in that subdirectory, unlike the root file, which loads at launch. (<https://docs.claude.com/en/docs/claude-code/memory>)
- The same documentation states that a .claude/rules/ file scoped with paths frontmatter loads only when Claude reads a file matching the pattern, not on every tool use, unlike an unscoped rule, which loads at launch. (<https://docs.claude.com/en/docs/claude-code/memory>)
- OpenAI's Codex documentation states that Codex concatenates every discovered AGENTS.md file into one combined prompt and stops adding files once the total reaches a configurable byte limit, 32 KiB by default, unlike Claude Code's per-directory on-demand loading. (<https://learn.chatgpt.com/docs/agent-configuration/agents-md.md>)

### 0007: Personal- and project-level instructions rank in opposite orders across tools

Rule: Do not assume a personal- or user-level instruction file automatically overrides a project-level one, or the reverse; confirm the specific tool's precedence before relying on it.

Applies to: general

#### Why

An instruction meant to be authoritative at one layer only works as intended if the author knows which layer wins when a personal- or user-scoped instruction and a project- or repository-scoped one disagree, and that ranking is not a shared convention — it's a design choice each tool states in its own documentation, and the two tools covered here state opposite choices.

#### When it applies

Applies whenever a personal- or user-scoped instruction and a project- or repository-scoped instruction could plausibly say different things about the same situation, in any tool that supports both layers. It does not apply to two instructions at the same layer that merely overlap without disagreeing, since both can simply hold at once there. It also does not settle whether either layer is actually followed on a given turn — confirming which layer ranks higher tells an author which text the tool positions as more authoritative, not that either is guaranteed to be honored.

#### Conflicting guidance

Claude Code's own documentation states that a user-level rule loads before a project-level rule, and that the project-level rule accordingly has higher priority. GitHub's own documentation of Copilot states the reverse ordering for the layers Copilot recognizes: a personal instruction takes the highest priority, ahead of a repository instruction, which in turn ranks above an organization instruction. An author who writes a personal-level override in one tool and assumes the same ranking carries over to the other will have it silently backwards. This load-order ranking between layers is a different question from what happens when two rules within a resolved context genuinely disagree in meaning, where the sibling practice on writing one canonical rule applies instead and no such ordering is promised.

#### Sources

- Claude Code's memory documentation states that user-level rules under ~/.claude/rules/ load before project-level rules, giving the project-level rules higher priority when both apply. (<https://docs.claude.com/en/docs/claude-code/memory>)
- GitHub's Copilot documentation states the opposite ordering for the analogous layers, personal instructions rank above repository instructions, which in turn rank above organization instructions. (<https://docs.github.com/en/copilot/concepts/prompting/response-customization>)

### 0008: Instruction files are context Claude tries to follow, not configuration that guarantees compliance

Rule: Treat instruction files as context with no guarantee of compliance; a requirement that must hold with zero exceptions belongs in a hook, a permission rule, or an external gate such as CI, not prose.

Applies to: claude-code

#### Why

An instruction file is delivered to Claude as a message it reads and reasons about, not as a mechanism the runtime enforces; writing a rule into CLAUDE.md does not by itself change what tool calls Claude Code will actually let through. A `PreToolUse` hook or a `permissions.deny` entry runs deterministically before an action executes, which is the only way to guarantee an outcome regardless of what Claude decides on a given turn. This is a different problem from the sibling practice on keeping always-loaded instructions minimal: that practice is about which content earns a place in the file at all, while this one is about what an instruction file, by its nature, can and cannot promise once a line is in it.

#### When it applies

Applies to any requirement an author is tempted to state as prose in CLAUDE.md, AGENTS.md, or a rule file because Claude usually follows it. The deterministic alternative is not limited to a hook or a permission rule — any gate the requirement actually runs through outside the live agent turn, such as a required CI check or branch protection, serves the same purpose. It does not apply to guidance where an occasional miss is an acceptable cost, or to something no deterministic mechanism can express, such as a stylistic preference or a design judgment — prose is still the right tool there.

#### Sources

- Claude Code's memory documentation states that Claude treats CLAUDE.md and auto memory as context rather than enforced configuration, and that blocking an action regardless of what Claude decides requires a PreToolUse hook instead. (<https://docs.claude.com/en/docs/claude-code/memory>)
- The same documentation, troubleshooting why an instruction wasn't followed, states that Claude reads CLAUDE.md and tries to follow it, but there is no guarantee of strict compliance, especially for vague or conflicting instructions. (<https://docs.claude.com/en/docs/claude-code/memory>)

### 0010: Target CLAUDE.md at under 200 lines

Rule: Keep each CLAUDE.md file under roughly 200 lines; once it grows past that, move directory- or file-type-specific content into path-scoped rules instead of continuing to grow the always-loaded file.

Applies to: claude-code

#### Why

This is a specific, numeric form of the more general principle that an always-loaded file should stay minimal: Claude Code's own documentation ties file length directly to adherence, stating that a longer CLAUDE.md consumes more context and reduces how reliably Claude follows its own instructions. 200 lines is not a hard cutoff the tool enforces; it is the point past which the same documentation recommends moving content out rather than continuing to grow a file every session pays for.

#### When it applies

Applies to the root CLAUDE.md and to any other CLAUDE.md loaded unconditionally at launch, such as a user-level file with no path scoping. It does not apply to a file that only loads on demand, such as a nested CLAUDE.md in a subdirectory or a `.claude/rules/` file scoped with `paths`, since a file that isn't loaded at every launch doesn't compete with startup context the same way. Splitting an oversized file into `@path` imports or into unscoped `.claude/rules/` entries does not satisfy the goal this target serves: both still load unconditionally at every launch, so the 200-line budget is best read as covering everything a session loads by default, not the byte count of one file alone.

#### Sources

- Claude Code's memory documentation gives a concrete size target for CLAUDE.md, stating that a longer file consumes more context and reduces how reliably Claude follows it. (<https://docs.claude.com/en/docs/claude-code/memory>)

## Antipatterns

### 0001: A repository-overview section in the instruction file

Rule: Do not add a repository-overview section to an instruction file; a controlled study found it does not help while context files overall raised inference cost.

Classification: harmful

Applies to: general

#### Symptom

The instruction file opens with a section describing the repository's purpose, architecture, or module layout, largely duplicating what a README's project-description section already covers.

#### Cause

Repository overviews are popular and recommended by several model providers as a way to orient an agent before it starts working, on the assumption that more upfront context yields better task performance.

#### Remedy

Drop the repository-overview section. The same "would removing this cause a mistake" test that argues for keeping always-loaded instructions minimal in general (see the sibling practice on that topic) applies here specifically: an agent that needs architectural detail can read the code, and the measured evidence is that a repository overview does not move task success while it does raise cost.

#### Sources

- A 2026 study of AGENTS.md-style context files found that repository-overview sections specifically, despite being popular and recommended by model providers, were not helpful, while context files overall raised inference cost by more than 20% without a general gain in task success. (<https://arxiv.org/abs/2602.11988>)

### 0002: Emphasis everywhere

Rule: Do not add emphasis such as "IMPORTANT" to many lines of an instruction file; emphasizing everything leaves none of it standing out.

Classification: harmful

Applies to: claude-code

#### Symptom

Many lines of an instruction file carry emphasis — bold text, "IMPORTANT," or a similar marker — spread across most of the file's content instead of reserved for the single line the agent actually keeps skipping.

#### Cause

Emphasis reads as a lever: when the agent skips an instruction, adding emphasis to that line looks like the fix, and it appears to work in isolation. An author who reaches for that lever once per skipped instruction ends up applying it wherever an instruction matters, which in most instruction files is nearly everywhere.

#### Remedy

Reserve emphasis for the one instruction the agent actually keeps skipping, and leave the rest of the file at normal weight. Anthropic's own CLAUDE.md guidance is explicit that emphasizing many lines leaves none of them standing out — emphasis only works as a contrast against a plain background, and a file that is emphasis-everywhere has no background left to contrast against. See the sibling practice on keeping always-loaded instructions minimal for the companion problem of length, distinct from the density of emphasis addressed here.

#### Sources

- Anthropic's Claude Code best-practices guide warns that emphasizing many lines in CLAUDE.md backfires, recommending emphasis such as "IMPORTANT" be reserved for the single line an agent keeps skipping. (<https://www.anthropic.com/engineering/claude-code-best-practices>)

### 0003: Committing an LLM-generated context file without substantial editing

Rule: Do not commit an AGENTS.md or CLAUDE.md an LLM generated and left as-is; a study found it did not reliably beat having no file, while a developer-written one significantly outperformed it.

Classification: harmful

Applies to: general

#### Symptom

The project's `AGENTS.md` or `CLAUDE.md` reads like it was generated in one pass and never substantially edited afterward. This often looks generic — a codebase overview that just restates directory names, conventions that sound plausible but don't reflect anything a maintainer actually decided — but a confidently specific file can hide the same problem: named modules, build commands, or conventions that read as decided because the model wrote them fluently, when nobody actually checked them against what the repository does.

#### Cause

Asking an agent to generate its own context file is fast, and the result looks complete, so it is tempting to commit it as-is instead of treating it as a first draft. The same evaluation that measured this found LLM-generated files raise inference cost by more than 20% on average without a corresponding, statistically significant gain in task success — the file looks like it should help and mostly doesn't, while making every subsequent run more expensive.

#### Remedy

Treat an LLM-generated context file as a draft that a maintainer edits before it is trusted, not as a finished artifact. The same study found developer-provided context files significantly outperformed the LLM-generated ones, so the gap this antipattern describes isn't between having a file and not — it's between a file someone actually reviewed and one nobody did. The sibling practice on keeping always-loaded instructions minimal applies here too: an LLM asked to write a context file tends to produce exactly the kind of generic, padded content that practice argues for cutting.

#### Sources

- A controlled study found LLM-generated context files caused performance drops in most of the settings tested, with neither benchmark's drop reaching statistical significance, while inference cost rose by more than 20% on average. (<https://arxiv.org/abs/2602.11988>)
- The same study found developer-provided context files significantly outperformed the LLM-generated ones, unlike the LLM-generated files' own null effect against having no context file at all. (<https://arxiv.org/abs/2602.11988>)

This file's content is drawn from `practices/` and `antipatterns/`, licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
