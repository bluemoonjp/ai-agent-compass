# Release

This page is the maintainer's own checklist for publishing a new version of
the `compass` plugin. It describes the mechanical steps in the order they
depend on each other; it says nothing about which of them an agent may run
unsupervised, since that is governed by this repository's own permission
configuration, not by this page.

## 1. Regenerate and verify

```bash
pnpm gen
pnpm test
pnpm check --strict
```

`pnpm check --strict` requires `COMPASS_PRIVATE_PATTERNS` to be set in the
current shell (see `docs/maintain/setup.md`). Run `pnpm gen` first so the
checks that follow see the fully regenerated state, not a stale one.

## 2. Validate the plugin and marketplace manifests

```bash
claude plugin validate . --strict
claude plugin validate ./plugins/compass --strict
```

## 3. Run the eval suite

```bash
claude plugin eval ./plugins/compass --trust-plugin --no-publish --max-cost-usd 3 --judge-model haiku --json <output-path>
```

Review the result for a fired-when-expected / silent-when-expected pattern
that matches the case names in `plugins/compass/evals/`, since a skill
`description` rewrite can silently change what triggers it. Before
committing any part of the result, redact absolute paths and run it through
`pnpm check:paste`.

## 4. Bump the version

Edit `version` in both `plugins/compass/.claude-plugin/plugin.json` and the
matching plugin entry in `.claude-plugin/marketplace.json`; `release-check`
fails the build if the two ever disagree. Open this change as a pull
request like any other change to this repository and merge it once CI is
green, per this repository's own working rules.

## 5. Tag and push

```bash
git tag v<version>
git push origin v<version>
```

The tag push triggers CI's `check` job with `COMPASS_RELEASE_TAG` set to the
pushed tag name; `release-check` then additionally confirms the plugin
manifest's `version` matches the tag. This is a CI-side check triggered by
the push, not a `--tag` flag on `release-check` itself — the script only
ever reads `COMPASS_RELEASE_TAG` from its environment. Create the GitHub
release (`gh release create v<version> ...`) once that CI run is green.

## 6. Install-test in a separate config directory

Verify the tagged version actually installs and fires, without touching
this machine's own Claude Code configuration. `claude plugin marketplace
add`, `claude plugin install`, `claude plugin list`, `claude plugin
uninstall`, and `claude plugin marketplace remove` need no authentication
and work against an empty `CLAUDE_CONFIG_DIR`; only running an actual prompt
against the installed plugin does, and that requires either logging in
again inside the new config directory or copying this machine's own
`~/.claude/.credentials.json` into it — a sensitive, one-off action to
approve explicitly each time, not something to script or repeat
unattended. If that step is skipped, the install/uninstall lifecycle check
above still verifies the distribution path works; only the live-fire
confirmation is deferred.

PowerShell:

```powershell
$tmp = New-Item -ItemType Directory -Path (Join-Path $env:TEMP ([System.Guid]::NewGuid()))
$env:CLAUDE_CONFIG_DIR = $tmp.FullName
claude plugin marketplace add bluemoonjp/ai-agent-compass
claude plugin install compass@ai-agent-compass
# exercise a skill, e.g. by running the eval suite again or a manual prompt
claude plugin uninstall compass@ai-agent-compass
claude plugin marketplace remove ai-agent-compass
Remove-Item Env:CLAUDE_CONFIG_DIR
Remove-Item -Recurse -Force $tmp
```

bash:

```bash
tmp=$(mktemp -d)
export CLAUDE_CONFIG_DIR="$tmp"
claude plugin marketplace add bluemoonjp/ai-agent-compass
claude plugin install compass@ai-agent-compass
# exercise a skill, e.g. by running the eval suite again or a manual prompt
claude plugin uninstall compass@ai-agent-compass
claude plugin marketplace remove ai-agent-compass
unset CLAUDE_CONFIG_DIR
rm -rf "$tmp"
```

Record which skill fired and how, in the release's tracking issue, with any
absolute path redacted first.

## 7. Re-confirm this repository's own session is unaffected

This repository's own working sessions never installed `compass` from a
marketplace (that would create the exact template-collision risk `templates/`
exists to avoid). After a release, re-run `/context` in a session started at
this repository's root and confirm `compass` still does not appear among the
always-loaded skills.

## 8. Audit anything about to become public

Before pasting eval output, `/context` output, or any shell output into the
release notes or a tracking issue, run it through `pnpm check:paste` (see
`docs/maintain/setup.md`).
