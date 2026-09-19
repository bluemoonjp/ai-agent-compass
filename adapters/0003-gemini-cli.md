---
id: "0003"
title: "Gemini CLI: every discovered context file concatenates into every prompt, by default under a different filename"
status: active
topic: instruction-files
applies_to:
  - gemini-cli
rule: Gemini CLI loads global, workspace, and just-in-time context files and concatenates all of them into every prompt; the filename it looks for is a configurable list, not fixed to GEMINI.md.
license: CC-BY-4.0
sources:
  - url: https://raw.githubusercontent.com/google-gemini/gemini-cli/main/docs/cli/gemini-md.md
    kind: primary
    confidence: verified
    verified_on: "2026-09-19"
    summary: Gemini CLI's own documentation states it loads context files from a global location, workspace directories and their parents, and just-in-time from a directory's ancestors when a tool accesses it, concatenating all found files and sending them with every prompt.
    quote: "It loads various context files from several locations, concatenates the contents of all found files, and sends them to the model with every prompt."
  - url: https://raw.githubusercontent.com/google-gemini/gemini-cli/main/docs/cli/gemini-md.md
    kind: primary
    confidence: verified
    verified_on: "2026-09-19"
    summary: The same documentation states the default context filename, GEMINI.md, can be replaced with a different name or a list of names through the context.fileName setting.
    quote: "While GEMINI.md is the default filename, you can configure this in your settings.json file. To specify a different name or a list of names, use the context.fileName property."
  - url: https://raw.githubusercontent.com/google-gemini/gemini-cli/main/docs/reference/memport.md
    kind: primary
    confidence: verified
    verified_on: "2026-09-19"
    summary: Gemini CLI's own memory-import-processor reference documents an @file.md import as resolved into the surrounding content, its processed-result type is defined as content with imports already resolved, not a reference kept for deferred loading.
    quote: "content: string; // The processed content with imports resolved"
---

## Why

Gemini CLI sources context from three tiers — a global file at `~/.gemini/GEMINI.md`, workspace files found by searching configured workspace directories and their parents, and just-in-time files discovered by scanning a directory and its ancestors up to a trusted root whenever a tool actually accesses that directory — and concatenates whatever it has found so far into the prompt, rather than loading each file only once and holding it in isolation. Global and workspace files are known before the session's first prompt, but a just-in-time file only enters that combined context once some tool has actually touched its directory, so the total a session carries grows turn by turn as more of the project gets visited, not as a single fixed figure set at session start. The default filename `GEMINI.md` is itself a setting, not a fixed name: `context.fileName` in `settings.json` can rename it to something else, or to a list of names Gemini CLI will look for, including `AGENTS.md`. An `@file.md` import inside a context file is resolved into that surrounding content before the result is used, not kept as a reference to load later.

| Moves to other tools | Stays Gemini-CLI-specific (numbers, event names, config keys) |
| --- | --- |
| A context-loading system can have a scope narrower than "everywhere," discovered relative to where the agent is actually working, not only from the project root | The `context.fileName` setting and its default value `GEMINI.md`; the `/memory show` and `/memory reload` commands for inspecting and forcing a rescan of loaded context |
| Breaking a large context file into smaller pieces reduces what loads at once — but only if the mechanism used actually defers loading | `@file.md` import syntax, which supports both relative and absolute paths and resolves into the surrounding content rather than deferring |

## When it applies

Applies to estimating how much context a Gemini CLI session carries, given that discovered files are concatenated rather than loaded in isolation — and to expecting that total to grow over the course of a session as just-in-time discovery touches more directories, not to hold constant from the first prompt. It does not apply to deciding whether to name the file `GEMINI.md` specifically — `context.fileName` makes that a configuration choice, including reusing the same `AGENTS.md` file another tool in the same project already reads.
