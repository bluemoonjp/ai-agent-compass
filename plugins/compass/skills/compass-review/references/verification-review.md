# verification-review

Generated from `practices/*.md` and `antipatterns/*.md` by `pnpm gen`; do not edit.

## Practices

### 0015: A structural compliance claim needs a controlled study behind it

Rule: Do not trust an unverified claim that an instruction file's size, position, or structure changes compliance; a factorial study found none of 4 such structural variables had a detectable effect.

Applies to: general

#### Why

A claim like "put the important rule first" or "split the file so it's shorter" sounds plausible enough to accept without checking, precisely because it is easy to imagine a mechanism for it. A factorial study of 1,650 Claude Code CLI sessions (16,050 function-level observations), across two TypeScript codebases, three models, and five coding tasks, manipulated four such structural variables — file size, instruction position, file architecture, and cross-file contradictions — and found none of them, nor their two-way interactions, produced a detectable contrast on compliance after correcting for multiple testing. The effect the same study did detect was not structural at all: within the session-length range it tested, each additional function generated was associated with roughly 5.6% lower odds of compliance for that step, though the study is explicit this relationship is non-monotonic, not a steady per-step decline — a within-session effect nobody was proposing a file-structure fix for.

#### When it applies

Applies to deciding whether to act on a claim that a specific structural choice in an instruction file changes how reliably an agent follows a specific, checkable instruction, before that choice becomes established practice. It does not apply to every possible structural variable, or to every value of the four this study tested — a file large enough to be truncated by a hard size limit, for instance, is a distinct, mechanically obvious case outside whatever size range the study manipulated, not the kind of unverified structural folklore this practice is about. It also does not equate "compliance with one checkable instruction" with the broader task reliability the sibling practice on context window degradation addresses; this study measured whether a specific rule was followed, not whether the agent's overall output quality held up as context grew.

#### Sources

- A factorial study of 1,650 Claude Code CLI sessions (16,050 function-level observations) across two TypeScript codebases and three models found that none of four structural variables, or their interactions, produced a detectable contrast after correction. (<https://arxiv.org/abs/2605.10039>)
- The same study found the largest measured effect was within-session, not structural, roughly 5.6% lower odds of compliance per additional function generated within the tested session-length range, though explicitly a non-monotonic relationship, not a constant per-step decline. (<https://arxiv.org/abs/2605.10039>)

This file's content is drawn from `practices/` and `antipatterns/`, licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
