---
type: llm
focus: last_message
---

PASS only if the response reaches all three of these outcomes, not merely commits to some outcome for each item, and cites a practice or antipattern id for each one:

1. Recommends deleting (or substantially rewriting away) the "Repository overview" section, citing antipattern `0001`.
2. Recommends removing or reducing the `**IMPORTANT**` emphasis markers on the five bullet points, citing antipattern `0002`.
3. Recommends converting at least the "always run npm test before committing" and "never commit directly to main" rules into a hook, lint rule, or required CI/branch-protection check rather than leaving them as prose, citing practice `0001`.

FAIL if any of the three outcomes above is missing, reversed (e.g. recommending the repository-overview section be kept), or given without citing the specific practice or antipattern id named above.
