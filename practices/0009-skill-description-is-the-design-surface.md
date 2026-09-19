---
id: "0009"
title: A skill's description is its primary design surface
status: active
topic: skills
applies_to:
  - claude-code
  - general
rule: Write a SKILL.md's description in the third person, stating both what the skill does and when to use it; it is the free-text field in what Claude pre-loads before deciding whether to load the skill.
license: CC-BY-4.0
sources:
  - url: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
    kind: primary
    confidence: verified
    verified_on: "2026-09-19"
    summary: Anthropic's Agent Skills best-practices docs state that the description field enables skill discovery and should state both what the skill does and when to use it.
    quote: "The description field enables Skill discovery and should include both what the Skill does and when to use it."
  - url: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
    kind: primary
    confidence: verified
    verified_on: "2026-09-19"
    summary: The same docs instruct writing the description in the third person, since it is injected into the system prompt and an inconsistent point of view can cause discovery problems.
    quote: "Always write in third person. The description is injected into the system prompt, and inconsistent point-of-view can cause discovery problems."
  - url: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
    kind: primary
    confidence: verified
    verified_on: "2026-09-19"
    summary: The same docs state that only a skill's name and description, not its body, are pre-loaded at startup, and that the body loads only once Claude judges the skill relevant.
    quote: "At startup, only the metadata (name and description) from all Skills is pre-loaded."
---

## Why

A skill's name and description are the only parts of it pre-loaded at startup; everything else stays invisible to Claude until it has already decided, from that metadata alone, that the skill might be relevant. Of the two, the name is a short, pattern-constrained slug with little room to design; the description is free text, and it is where a vague or first-person account of the skill degrades the one decision point that determines whether the rest ever loads. Treating the description as an afterthought written once the body is done gets the effort backwards — it deserves at least as much design attention as the procedure it introduces.

## When it applies

Applies to writing or revising any SKILL.md's `description` field, both when a skill is first authored and whenever its trigger conditions are later rewritten. It does not apply to the body content a skill loads once selected — that content is free to use whatever voice suits a procedure, since by the time Claude reads it the discovery decision has already been made.
