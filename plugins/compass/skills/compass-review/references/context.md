# context

Generated from `practices/*.md` and `antipatterns/*.md` by `pnpm gen`; do not edit.

## Practices

### 0012: Context window reliability degrades with input length, even on simple tasks

Rule: Do not assume a model uses its full context window uniformly; treat added context as a cost that can lower reliability on its own, and keep loaded context small regardless of the window's rated size.

Applies to: general

#### Why

It is tempting to treat a model's rated context window as a uniform budget: if the task fits, the task should work. Evaluating 18 LLMs, including GPT-4.1, Claude 4, Gemini 2.5, and Qwen3 models, Chroma's Context Rot report found that performance instead grows increasingly unreliable as input length grows, even on simple tasks where difficulty is not the confound. Two long documents are not interchangeable just because both fit the window; the longer one measurably costs more. This is a broader, independently sourced version of the same conclusion the sibling practice on keeping always-loaded instructions minimal reaches for one specific file: that practice is about what belongs in an always-loaded CLAUDE.md; this one is about context loaded through any channel, in any tool, supported by evidence that holds across 18 different models rather than one vendor's own guidance.

#### When it applies

Applies to any decision about how much to load into a model's context — conversation history, retrieved documents, tool output, or an instruction file — regardless of whether the total stays well under the window's rated limit. It does not apply to deciding whether a single piece of content is relevant enough to include at all; that is a separate judgment this practice doesn't settle, only the cost side of the trade-off once something is judged relevant. It also does not resolve itself by summarizing or chunking long content instead of trimming it: a summary is shorter, but the summarizing step has its own error rate, and this practice offers no evidence about whether that trade is a net improvement.

#### Sources

- Chroma's Context Rot technical report evaluated 18 LLMs, including GPT-4.1, Claude 4, Gemini 2.5, and Qwen3 models, and found that model performance varies significantly as input length changes, even on simple tasks. (<https://www.trychroma.com/research/context-rot>)
- The same report states that performance grew increasingly unreliable as input length grew, contrary to the common assumption that a model processes every position in its context window equally reliably. (<https://www.trychroma.com/research/context-rot>)
- The same report states it evaluated 18 LLMs, including GPT-4.1, Claude 4, Gemini 2.5, and Qwen3 models, which is the basis for its claim that the effect holds broadly rather than in one model family. (<https://www.trychroma.com/research/context-rot>)

### 0013: Only the always-loaded root file is guaranteed to survive compaction

Rule: After /compact, only the root CLAUDE.md is guaranteed to re-inject; a nested CLAUDE.md or path-scoped rule re-injects only once its trigger fires again, and a conversation-only note does not.

Applies to: claude-code

#### Why

`/compact` discards the conversation it summarizes, and what reappears afterward depends on how each piece of context got there in the first place. The root CLAUDE.md is re-read from disk and re-injected automatically, so it survives compaction the same way it survived session start. A nested CLAUDE.md or a `paths`-scoped rule was never loaded unconditionally to begin with — it appeared because Claude read a matching file — so after compaction it stays absent until that same trigger fires again. An instruction that only ever existed as something typed mid-conversation has no file to re-read from and does not come back at all.

#### When it applies

Applies to deciding whether an instruction needs to survive a long session that may eventually compact, including deciding where to put something currently sitting only in conversation. It does not apply within a single, uncompacted session, where a nested file or a path-scoped rule that already triggered once behaves the same as any other loaded context until compaction actually happens. The guarantee this practice states is specifically about a project-root CLAUDE.md, since that is what the cited documentation names; it does not confirm whether an unscoped `.claude/rules/` file, an `@`-imported file, or a user-level global CLAUDE.md shares the same guarantee, even though each of those also loads unconditionally at session start — treat that as an open question the cited source doesn't settle, not as something this practice extends to them.

#### Sources

- Claude Code's memory documentation states that a project-root CLAUDE.md survives compaction because Claude re-reads it from disk and re-injects it into the session after /compact runs. (<https://docs.claude.com/en/docs/claude-code/memory>)
- The same documentation states that a nested CLAUDE.md or a paths-scoped rule instead reloads only when Claude reads a file it applies to, not automatically alongside the root file after compaction. (<https://docs.claude.com/en/docs/claude-code/memory>)
- The same documentation states that an instruction missing after compaction was either given only in conversation, lives in a nested CLAUDE.md that hasn't reloaded yet, or is a path-scoped rule that hasn't matched a file since. (<https://docs.claude.com/en/docs/claude-code/memory>)

This file's content is drawn from `practices/` and `antipatterns/`, licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
