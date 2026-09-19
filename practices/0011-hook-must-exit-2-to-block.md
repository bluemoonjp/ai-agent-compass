---
id: "0011"
title: A hook must exit 2 to block; silence does not mean approval
status: active
topic: hooks-permissions
applies_to:
  - claude-code
rule: For most Claude Code hook events, only exit code 2 blocks the action; exit code 0 or 1 both let it proceed to the normal permission flow, which can still deny it on its own.
license: CC-BY-4.0
sources:
  - url: https://docs.claude.com/en/docs/claude-code/hooks
    kind: primary
    confidence: verified
    verified_on: "2026-09-19"
    summary: Claude Code's hooks reference states that exit code 0 with no output means the hook reported no decision, so the tool call falls through to the normal permission flow rather than being approved by the hook's silence.
    quote: "Exit code 0 with no output means the hook has no decision to report, so the tool call continues through the normal permission flow. The hook can deny the call, but staying silent doesn't approve it."
  - url: https://docs.claude.com/en/docs/claude-code/hooks
    kind: primary
    confidence: verified
    verified_on: "2026-09-19"
    summary: The same reference states that, absent valid JSON on stdout, exit code 1 is treated as a non-blocking error rather than the Unix convention of a general failure, and that a hook meant to enforce a policy must use exit code 2 instead.
    quote: "Without valid JSON on stdout, Claude Code treats exit code 1 as a non-blocking error and proceeds with the action, even though 1 is the conventional Unix failure code. If your hook is meant to enforce a policy, use exit 2."
  - url: https://docs.claude.com/en/docs/claude-code/hooks
    kind: primary
    confidence: verified
    verified_on: "2026-09-19"
    summary: The same reference states that exit code 2's effect depends on the event, since some events represent an action that can still be blocked while others represent something that already happened and cannot be prevented.
    quote: "The effect depends on the event, because some events represent actions that can be blocked (like a tool call that hasn't happened yet) and others represent things that already happened or can't be prevented."
---

## Why

A shell script's exit code 1 conventionally signals failure, and it is easy to assume that signaling failure from a `PreToolUse` hook stops the tool call. Claude Code does not read a bare exit 1 that way: for most events, exit code 2 is the only code that blocks through the exit code alone, and 0 or 1 both let the call fall through to the normal permission flow instead. That flow can still deny the call on its own terms, so a hook author who returns 1 on a policy violation has not necessarily approved the action — but they also have not written the deterministic block they may have intended, since nothing about the hook itself stopped the call.

## When it applies

Applies to writing a Claude Code hook meant to enforce a policy by blocking an action, in particular a `PreToolUse` hook meant to block a tool call — there, exit code 2 is the reliable signal and JSON-free exit 1 is not. It does not apply uniformly across every hook event: whether an event can be blocked at all, and what exit 2 does when it can't, varies per event, since some events represent an action that hasn't happened yet while others represent something already done or already decided. It also does not apply to the worktree events, `WorktreeCreate` and `WorktreeRemove`, where any non-zero exit code — including 1 — does block, unlike the general case this practice describes.
