# evidence

Generated from `practices/*.md` and `antipatterns/*.md` by `pnpm gen`; do not edit.

## Practices

### 0014: An AGENTS.md file is associated with lower runtime and token cost

Rule: Do not assume a repository-level context file only affects correctness; a controlled comparison found its presence associated with lower runtime and token cost, at comparable task completion.

Applies to: general

#### Why

It is easy to treat a repository-level context file as a correctness-only lever: it either helps the agent get the task right or it doesn't. Each of 124 real pull request tasks across 10 repositories was executed once with and once without the repository's AGENTS.md file, in matched, isolated environments on the identical pre-merge commit; that paired comparison found AGENTS.md's presence associated with a lower median runtime (28.64%) and lower median output token consumption (16.58%), at comparable task completion. The study is explicit that its completion check was a sanity check for non-empty, non-trivial output rather than a full correctness evaluation — so the finding supports treating AGENTS.md as an efficiency lever worth measuring, not a settled claim that completion quality was unaffected.

#### When it applies

Applies to deciding what evidence to look for when justifying a repository-level context file that a maintainer wrote or reviewed: runtime and token cost are outcomes worth measuring alongside correctness, not just correctness alone. It does not apply to a single repository or a small number of runs, where the variance this study's own standard-deviation figures show is large enough that one anecdote could point either way. It also does not apply to a file nobody reviewed — the sibling antipattern on committing an LLM-generated context file without substantial editing describes a case where the file's presence raised cost instead of lowering it, so this practice's benefit presumes the file is one worth having, not merely one that exists.

#### Conflicting guidance

This finding and a different controlled study's finding point in opposite directions on cost. This practice's source measured 124 real pull requests on repositories that already had an AGENTS.md file, comparing the same task run with and without it. A separate study, evaluating agents on SWE-bench and a novel benchmark of repositories with developer-committed context files, found context files raised inference cost by more than 20% on average without a general gain in task success — a result it states holds for developer-committed files too, not only LLM-generated ones. The two studies differ in task population and in what "with a context file" means (an established file a real project already uses, versus a file evaluated across held-out benchmark tasks), and neither study explains the other's result; treat the direction of the cost effect as unsettled rather than assuming either finding generalizes to a project this practice's own source didn't measure.

#### Sources

- A study analyzing 10 repositories and 124 pull requests, run with and without an AGENTS.md file, found its presence associated with a lower median runtime (28.64%) and reduced median output token consumption (16.58%), while task completion behavior stayed comparable. (<https://arxiv.org/abs/2601.20404>)
- The same study notes its completion check was a sanity check for non-empty, non-trivial changes rather than a full correctness evaluation, so its efficiency findings should not be read as also proving completion quality was unaffected. (<https://arxiv.org/abs/2601.20404>)
- A different controlled study, on SWE-bench and a novel CTXbench, found context files did not generally improve task success while raising inference cost, holding for both LLM-generated and developer-committed files, the opposite cost direction from this practice's own source. (<https://arxiv.org/abs/2602.11988>)

### 0016: Refined repository guidance improves coverage, not per-patch precision — and can hurt a weaker model

Rule: Do not assume improving repository guidance makes an agent's individual fixes better; one study found it raised coverage with precision unchanged on a capable model, while hurting a weaker model.

Applies to: general

#### Why

Better repository guidance sounds like it should make an agent's fixes better, but a study using synthetic bug-fix probes to iteratively refine a repository's guidance found the improvement came from a different place: across four trials on SWE-bench Verified with Qwen3.5-35B-A3B, the refined guidance let the agent produce an evaluable patch for 14.5 more percentage points of instances, while the quality of each individual patch, once produced, stayed statistically unchanged. Guidance helped the agent reach the right file more often; it did not make the agent better at fixing what it found once there. The same study's cross-model check makes the limit explicit: guidance tuned on a smaller, capacity-constrained model (NVIDIA-Nemotron-3-Nano-30B-A3B) produced the opposite pattern — every guided condition underperformed the unguided baseline instead of improving on it.

#### When it applies

Applies to deciding what to expect from investing in better repository guidance, and to which model that guidance was tuned for. It does not apply as a claim that guidance never affects patch quality on any model or benchmark — this study measured one capable model and one capacity-constrained model on one benchmark, and its own cross-model result shows the direction of the effect is not fixed. It also does not apply to whether guidance is worth having at all; the coverage gain alone was large enough to raise the capable model's resolve rate from 25.5% to 33.0%. This is a claim about guidance produced by iterative, probe-based refinement specifically, not about a repository's context file in general — a separate study's finding that generic context files don't reliably raise task success (see the sibling antipattern on a repository-overview section) describes a different intervention, an unrefined file rather than one tuned against synthetic bug-fix probes.

#### Sources

- On SWE-bench Verified with Qwen3.5-35B-A3B, iteratively refining repository guidance through synthetic bug-fix probes raised the resolve rate from 25.5% unguided to 33.0%, producing evaluable patches for 14.5 more percentage points of instances, with per-patch precision statistically unchanged. (<https://arxiv.org/abs/2606.20512>)
- The same study's cross-model check found the opposite pattern on a different, capacity-constrained model, guidance tuned on that model made every guided condition underperform the unguided baseline instead of improving on it. (<https://arxiv.org/abs/2606.20512>)

### 0017: Context files specify functional detail far more than security or performance

Rule: Do not assume a context file covers non-functional requirements just because it covers functional ones; a study found security/performance guidance in roughly 1 in 7 files, versus most for tests.

Applies to: general

#### Why

A context file that thoroughly documents how to run tests and where the architecture lives can still say nothing about what the agent must never do to the security posture or the performance budget, and a large-scale content analysis of 2,303 agent context files across 1,925 repositories found exactly that split: test procedures and implementation detail each appear in roughly seven or eight files out of ten, while security and performance guidance each appear in roughly one file out of seven. A file that looks comprehensive because it covers the functional categories well may simply never have been checked against the non-functional ones.

#### When it applies

Applies to auditing an existing context file for gaps, or to drafting a checklist of instruction categories before writing one from scratch — security and performance deserve deliberate inclusion rather than an assumption that thorough functional coverage already implies they're addressed. It does not apply to every project equally; a project with no meaningful security surface or performance budget has nothing to lose by the gap this study measured, and forcing a security or performance section into such a file would be padding, not coverage. It also does not apply where security or performance is already enforced through a mechanism outside the context file's prose — a required CI check, a linter, or a linked security policy — since the study measured what a context file's own text specifies, not whether a project addresses these requirements at all.

#### Sources

- A content analysis of 2,303 agent context files from 1,925 repositories, across 16 instruction types, found developers prioritize functional context such as test procedures (75.9%) and implementation details (70.8%), while security (14.8%) and performance (14.5%) are rarely specified. (<https://arxiv.org/abs/2511.12884>)

This file's content is drawn from `practices/` and `antipatterns/`, licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
