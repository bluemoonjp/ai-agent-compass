---
id: "0016"
title: Refined repository guidance improves coverage, not per-patch precision — and can hurt a weaker model
status: active
topic: evidence
applies_to:
  - general
rule: Do not assume improving repository guidance makes an agent's individual fixes better; one study found it raised coverage with precision unchanged on a capable model, while hurting a weaker model.
license: CC-BY-4.0
sources:
  - url: https://arxiv.org/abs/2606.20512
    kind: research
    confidence: verified
    verified_on: "2026-09-19"
    summary: On SWE-bench Verified with Qwen3.5-35B-A3B, iteratively refining repository guidance through synthetic bug-fix probes raised the resolve rate from 25.5% unguided to 33.0%, producing evaluable patches for 14.5 more percentage points of instances, with per-patch precision statistically unchanged.
    quote: "The improvement comes from coverage rather than precision: refined guidance produces evaluable patches for 14.5 percentage points (pp) more instances while per-patch precision remains statistically constant (~59%, p=0.119)"
  - url: https://arxiv.org/abs/2606.20512
    kind: research
    confidence: verified
    verified_on: "2026-09-19"
    summary: The same study's cross-model check found the opposite pattern on a different, capacity-constrained model, guidance tuned on that model made every guided condition underperform the unguided baseline instead of improving on it.
    quote: "Nemotron's results, using guidance tuned on Nemotron itself, show the opposite pattern to Qwen's: all guidance conditions underperform the unguided baseline"
---

## Why

Better repository guidance sounds like it should make an agent's fixes better, but a study using synthetic bug-fix probes to iteratively refine a repository's guidance found the improvement came from a different place: across four trials on SWE-bench Verified with Qwen3.5-35B-A3B, the refined guidance let the agent produce an evaluable patch for 14.5 more percentage points of instances, while the quality of each individual patch, once produced, stayed statistically unchanged. Guidance helped the agent reach the right file more often; it did not make the agent better at fixing what it found once there. The same study's cross-model check makes the limit explicit: guidance tuned on a smaller, capacity-constrained model (NVIDIA-Nemotron-3-Nano-30B-A3B) produced the opposite pattern — every guided condition underperformed the unguided baseline instead of improving on it.

## When it applies

Applies to deciding what to expect from investing in better repository guidance, and to which model that guidance was tuned for. It does not apply as a claim that guidance never affects patch quality on any model or benchmark — this study measured one capable model and one capacity-constrained model on one benchmark, and its own cross-model result shows the direction of the effect is not fixed. It also does not apply to whether guidance is worth having at all; the coverage gain alone was large enough to raise the capable model's resolve rate from 25.5% to 33.0%. This is a claim about guidance produced by iterative, probe-based refinement specifically, not about a repository's context file in general — a separate study's finding that generic context files don't reliably raise task success (see the sibling antipattern on a repository-overview section) describes a different intervention, an unrefined file rather than one tuned against synthetic bug-fix probes.
