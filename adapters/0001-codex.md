---
id: "0001"
title: "Codex: root-down concatenation with a byte cap, not per-file on-demand loading"
status: active
topic: instruction-files
applies_to:
  - codex
rule: Codex discovers instruction files from the project root down to the working directory and concatenates them into one prompt that stops growing once it reaches a configurable byte cap.
license: CC-BY-4.0
sources:
  - url: https://developers.openai.com/codex/guides/agents-md
    kind: primary
    confidence: verified
    verified_on: "2026-09-19"
    summary: Codex's own documentation states it concatenates instruction files from the project root down, joining them with blank lines, so a file closer to the working directory overrides earlier guidance because it appears later in the combined prompt.
    quote: "Codex concatenates files from the root down, joining them with blank lines. Files closer to your current directory override earlier guidance because they appear later in the combined prompt."
  - url: https://developers.openai.com/codex/guides/agents-md
    kind: primary
    confidence: verified
    verified_on: "2026-09-19"
    summary: The same documentation states Codex stops adding files to the combined prompt once their total size reaches a configurable limit, 32 KiB by default, and describes it as raiseable by editing the setting.
    quote: "Codex skips empty files and stops adding files once the combined size reaches the limit defined by `project_doc_max_bytes` (32 KiB by default)."
  - url: https://developers.openai.com/codex/guides/agents-md
    kind: primary
    confidence: verified
    verified_on: "2026-09-19"
    summary: The same documentation's troubleshooting section confirms which files are lost when the cap is hit, since files are added root-first, reaching the cap drops whatever would have been added last, the guidance closest to the working directory that the merge order says should override the rest.
    quote: "Instructions truncated: Raise `project_doc_max_bytes` or split large files across nested directories to keep critical guidance intact."
---

## Why

Codex walks from the project root down to the current working directory and, in each directory, picks at most one file — `AGENTS.override.md` first, then `AGENTS.md`, then any name listed in `project_doc_fallback_filenames`, never combining two candidate names found in the same directory — and concatenates every file it picks into a single combined prompt, root first. A file closer to the working directory ends up later in that combined text and overrides earlier guidance by position, not by any explicit precedence rule. The concatenation is not unbounded: once the running total reaches `project_doc_max_bytes` (32 KiB by default), Codex stops adding further files. Because the walk adds root files first and working-directory files last, hitting the cap drops whatever would have been added last — the guidance closest to the working directory that the merge order was supposed to let override everything above it, not the broad root-level guidance a reader might assume is expendable.

| Moves to other tools | Stays Codex-specific (numbers, config keys) |
| --- | --- |
| A file closer to where the agent is working can override broader, higher-level guidance — but only up to whatever cap the tool's own combination mechanism enforces | `AGENTS.override.md` as the highest-priority filename per directory; `project_doc_fallback_filenames` for additional names Codex accepts |
| A size cap on combined instructions can silently drop the most specific, override-intent guidance rather than the broad guidance it was meant to override, if combination proceeds broad-first | `project_doc_max_bytes`, defaulting to 32 KiB, as the hard cap on the combined prompt's size |

## When it applies

Applies to designing how many `AGENTS.md` files a Codex project nests, and how much each one contains, given that all of them the walk discovers are combined into one prompt up to the byte cap — and that hitting the cap costs the most specific, closest-to-working-directory guidance, not the broadest. It also applies to naming: adding `AGENTS.override.md` in a directory that already has an `AGENTS.md` replaces that file for Codex's purposes rather than combining with it, since only one candidate name is picked per directory. It does not apply to a Codex project with a single root-level `AGENTS.md` well under the cap, where the concatenation mechanism, its limit, and the per-directory filename choice never come into play.
