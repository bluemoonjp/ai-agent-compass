---
type: tool_used
tool: Skill
input_match: '"skill"\s*:\s*"(?:[\w-]+:)?compass-instruction-file"'
min: 0
max: 0
arm: both
---

Asserts compass-instruction-file did not fire for this unrelated task, scored in both arms so a false-positive fire is caught even without a plugin baseline to compare against.
