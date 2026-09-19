---
name: compass-review
description: Use when reviewing another project's instruction file, skill, or design document for compliance with sourced best practices for AI coding agents — judging each applicable practice as followed, violated, or not applicable, and citing the practice id and its source for every verdict. Use when asked to audit, review, or check an AGENTS.md, CLAUDE.md, SKILL.md, or similar artifact against established guidance, not when drafting one from scratch.
license: MIT
metadata:
  topics:
    - instruction-files
    - docs
    - skills
    - hooks-permissions
    - context
    - verification-review
    - evidence
---

# compass-review

## Procedure

1. Read every `references/<topic>.md` file this skill ships (one per topic listed above). Each one carries every active practice and antipattern for that topic — id, rule, applies_to, and the sourced reasoning behind each — generated from this plugin's source of truth. Do not cite an id that isn't in one of these files.
2. Identify the target artifact (an instruction file, a `SKILL.md`, or a design document) and which tool it is actually for. Where a practice's `applies_to` lists more than one tool, apply only the guidance for the target's actual tool; where it lists `general`, it applies regardless of tool.
3. For each practice whose topic and `applies_to` could plausibly cover the target, probe the artifact for the specific, checkable condition that practice's `Why` and `When it applies` describe — a concrete search for the pattern or its absence, not a holistic impression — following arXiv:2606.20512's finding that guidance grounded in a targeted, diagnostic check reaches the right evidence more reliably than an unguided read. Record one verdict per practice:
   - **Follows.** The artifact does what the rule says, or the practice's own "When it applies" boundary is satisfied by how the artifact already handles the case.
   - **Violates.** The artifact does the specific thing the rule or the antipattern's Symptom describes; quote or paraphrase the exact line or section that shows it.
   - **Not applicable.** The practice's own "When it applies" section excludes this artifact, this tool, or this situation — state which clause excludes it, not just that it seems out of scope.
4. Apply the same probe to every antipattern whose topic could plausibly cover the target, using its Symptom as the check and its Remedy as what a **Violates** verdict should point the target toward.
5. Output one table — practice or antipattern id, verdict, evidence from the artifact, and the source the practice cites — followed by a short summary grouped by verdict. Cite only ids and sources that appear in the `references/` files read in step 1; never state a rule from memory or invent a citation for one not covered there.
