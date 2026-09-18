---
type: llm
focus: last_message
---

PASS if the response commits to exactly one outcome (delete, keep as prose, or convert to a hook/check) for each instruction-file line or section it discusses, citing a practice or antipattern id for each choice.

FAIL if the response presents two options as equally valid without picking one (for example, "you could either keep this or remove it," "it depends," or a list of pros and cons with no recommendation), or if it gives a recommendation without citing any practice or antipattern id.
