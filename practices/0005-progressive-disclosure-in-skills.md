---
id: "0005"
title: "Progressive disclosure: name and description at startup, body on demand, references one level deep"
status: active
topic: instruction-files
applies_to:
  - claude-code
  - general
rule: Keep a skill's name and description as the only startup-loaded metadata, its body loaded on demand, and reference files linked no more than one level deep from SKILL.md.
license: CC-BY-4.0
sources:
  - url: https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
    kind: primary
    confidence: verified
    verified_on: "2026-09-18"
    summary: Anthropic's Agent Skills engineering post describes progressive disclosure, a skill's name and description load into the system prompt at startup, and its full SKILL.md body loads only if Claude judges the skill relevant to the task.
    quote: "At startup, the agent pre-loads the name and description of every installed skill into its system prompt. This metadata is the first level of progressive disclosure: it provides just enough information for Claude to know when each skill should be used without loading all of it into context."
  - url: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
    kind: primary
    confidence: verified
    verified_on: "2026-09-18"
    summary: Anthropic's Agent Skills best-practices docs recommend keeping reference files one level deep from SKILL.md, since Claude may only partially read a file reached through a chain of nested references.
    quote: "Keep references one level deep from SKILL.md. All reference files should link directly from SKILL.md to ensure Claude reads complete files when needed."
---

## Why

Anthropic's own description of Agent Skills lays out progressive disclosure as staged, relevance-gated loading: at startup, the agent pre-loads only a skill's `name` and `description` into its system prompt, and loads the skill's full body only once it judges that skill relevant to the current task. A further tier exists for files a `SKILL.md` links out to, and Anthropic's best-practices guidance adds a constraint the first source does not spell out on its own: those reference files should link directly from `SKILL.md`, one level deep, because an agent following a chain of nested references may only partially read a file instead of loading it whole, losing information the author assumed would arrive complete.

## When it applies

Applies to authoring any `SKILL.md`-based skill for an agent that supports this progressive-disclosure model, and to deciding what belongs in the top-level file versus a linked reference file. It does not apply to content an agent loads eagerly regardless of relevance, such as an always-loaded instruction file, and it does not forbid a skill from bundling many reference files — only from chaining them through each other instead of linking each one directly from `SKILL.md`.
