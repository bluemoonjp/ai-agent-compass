---
id: "0004"
title: An environment-variable opt-in instruction that outlived its default
status: active
topic: instruction-files
applies_to:
  - claude-code
rule: Do not keep an instruction to set an env var opting into a behavior after the tool made it default for that platform; check whether the variable's meaning has since flipped to opt-out.
license: CC-BY-4.0
classification: obsolete
relates_to:
  - "0001"
sources:
  - url: https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md
    kind: primary
    confidence: verified
    verified_on: "2026-09-19"
    summary: Claude Code's own changelog (v2.1.111) documents the PowerShell tool as progressively rolling out to Windows users, with the CLAUDE_CODE_USE_POWERSHELL_TOOL environment variable available to opt in or out during that rollout.
    quote: "Windows: PowerShell tool is progressively rolling out. Opt in or out with `CLAUDE_CODE_USE_POWERSHELL_TOOL`."
  - url: https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md
    kind: primary
    confidence: verified
    verified_on: "2026-09-19"
    summary: A later changelog entry (v2.1.143) documents the same variable's meaning changing for one platform and provider combination, the PowerShell tool became default-on for Windows Bedrock, Vertex, and Foundry users, and the variable switched to an opt-out, set to 0 to disable.
    quote: "The PowerShell tool is now enabled by default on Windows for Bedrock, Vertex, and Foundry users. Opt out with `CLAUDE_CODE_USE_POWERSHELL_TOOL=0`."
---

## What we did

An instruction file told the agent to set `CLAUDE_CODE_USE_POWERSHELL_TOOL=1` on Windows so the PowerShell tool would be available immediately, because at the time the tool was only progressively rolling out and not every account had it yet.

## Why it worked

During the rollout, explicitly setting the variable was a way to guarantee the tool was available rather than waiting on whatever automatic timeline applied to that account, so the instruction was genuinely useful for anyone who wanted the tool right away.

## What changed

A later release made the PowerShell tool default-on for Windows users on Bedrock, Vertex, and Foundry, and repurposed the same variable as an opt-out (`=0` to disable) for that population instead. An instruction that still says "set it to 1 to enable" is now vestigial there — harmless, since setting an opt-out variable to 1 is a no-op, but pointless, and it misdescribes what the variable currently does. The instruction is not vestigial everywhere: the source shows the default-on change scoped to Windows Bedrock/Vertex/Foundry specifically, so the same instruction may still be live and useful for a different platform or provider, and even within that rollout the changelog itself calls it progressive — two accounts on the same platform and provider could have reached the default at different times, so no single date cleanly separates "still needed" from "vestigial" for everyone.

## What to do now

Before keeping an environment-variable opt-in instruction, check the tool's current changelog for whether that specific platform and provider combination's default has since changed, rather than assuming an instruction that was once necessary still is — but check against the changelog for the version the project is actually pinned to, not always the latest one; a project intentionally running an older release may still need the older instruction regardless of what a newer changelog says. When the pinned version's own history shows the default has changed, delete the instruction rather than leaving a now-inert variable assignment in place.
