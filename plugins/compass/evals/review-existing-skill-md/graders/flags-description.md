---
type: llm
focus: last_message
---

PASS if the response flags the `description` field ("I can help you make reports") as violating sourced guidance, on both grounds: it is written in the first person instead of the third person, and it doesn't state when the skill should be used, citing a practice id for the judgment.

FAIL if the response doesn't identify the description as a problem, cites no practice id, or rewrites the file instead of stating an audit verdict.
