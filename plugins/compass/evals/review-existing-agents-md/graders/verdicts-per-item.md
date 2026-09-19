---
type: llm
focus: last_message
---

PASS only if the response gives a distinct compliance verdict (compliant/follows, or violates/non-compliant) for each of these three things, citing a practice or antipattern id for each:

1. The "Repository overview" section — flagged as violating guidance against repository-overview sections, citing antipattern `0001`.
2. The repeated `**IMPORTANT**` emphasis markers — flagged as violating guidance against pervasive emphasis, citing antipattern `0002`.
3. At least one item treated as compliant or not applicable, not everything flagged as a violation.

FAIL if any of the three is missing, if a verdict is given without citing an id, or if the response reads as a rewrite proposal instead of an audit with verdicts.
