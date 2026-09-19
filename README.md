# ai-agent-compass

[![CI](https://github.com/bluemoonjp/ai-agent-compass/actions/workflows/ci.yml/badge.svg)](https://github.com/bluemoonjp/ai-agent-compass/actions/workflows/ci.yml)

## English

### What this is

Best practices for AI coding agents, distilled from primary sources and research, with machinery that keeps them from rotting.

### Who reads it

An AI coding agent working on some other project is the primary reader; a human maintains this repository and reviews what an agent proposes.

### Status

alpha. The skeleton, checks, and a pilot set of content exist; broader content and tool adapters are still being built out issue by issue.

### How to use

Clone this repository, then copy `templates/AGENTS.md.template` and `templates/CLAUDE.md.template` into your own project, stripping the `.template` suffix as each file instructs.

<!-- gen:start:how-to-use-en -->
_Generated from `practices/*.md` by `pnpm gen`; do not edit this block._ **17** active practices are indexed in [`practices/index.md`](practices/index.md), licensed under [CC BY 4.0](LICENSE-DOCS).
<!-- gen:end:how-to-use-en -->

Or install `compass` as a Claude Code plugin: `/plugin marketplace add bluemoonjp/ai-agent-compass`, then `/plugin install compass@ai-agent-compass` (from a shell: `claude plugin marketplace add`/`claude plugin install`). Without a marketplace, copy a skill directory from `plugins/compass/skills/` straight into `~/.claude/skills/<name>/` instead. A third-party marketplace like this one has auto-update off by default (`/plugin` → Marketplaces to turn it on), and even with it on, `compass`'s pinned `version` only advances when that field is bumped in a release.

### Layout

See the Map table in this repository's own [AGENTS.md](AGENTS.md) for what each top-level directory holds.

### Update policy

A weekly patrol proposes updates against primary sources; a human approves every change. Nothing lands on `main` without review.

### License

Documentation (practices, antipatterns, adapters, docs, and this README's prose) is licensed under [CC BY 4.0](LICENSE-DOCS). Code, scripts, schemas, templates, skills, and configuration are licensed under [MIT](LICENSE). Paths not listed in either place are MIT. Short verbatim quotations belong to their original authors and are reproduced only for verification.

### Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

### How this differs

Every claim traces to a source and a verification date, not just a plausible-sounding rule. Content is organized for an agent to read at the moment it acts, not as a wiki for humans to browse. A repeatable check, not a one-time review, is what keeps the content from drifting out of date.

## 日本語

### What this is

AI コーディングエージェントのためのベストプラクティス集です。一次情報と研究から蒸留し、腐らせないための仕組みを備えます。

### Who reads it

主な読者は他のプロジェクトで作業する AI コーディングエージェントです。このリポジトリ自体は人間が保守し、エージェントの提案をレビューします。

### Status

alpha。骨格・検査・パイロット内容は揃っています。より広い内容とツール別アダプタは Issue ごとに積んでいる途中です。

### How to use

このリポジトリを clone し、`templates/AGENTS.md.template` と `templates/CLAUDE.md.template` を自分のプロジェクトにコピーしてください。各ファイルの指示どおり `.template` 拡張子を外します。

<!-- gen:start:how-to-use-ja -->
_`practices/*.md` から `pnpm gen` で生成。このブロックは編集しないこと。_ **17** 件の active な practice を [`practices/index.md`](practices/index.md) に索引化(ライセンス: [CC BY 4.0](LICENSE-DOCS))。
<!-- gen:end:how-to-use-ja -->

または Claude Code プラグインとして `compass` を install できます: `/plugin marketplace add bluemoonjp/ai-agent-compass` の後 `/plugin install compass@ai-agent-compass`(シェルからは `claude plugin marketplace add`/`claude plugin install`)。marketplace を使わない場合は `plugins/compass/skills/` 配下のスキルディレクトリを `~/.claude/skills/<name>/` に直接コピーしてください。このリポジトリのようなサードパーティ marketplace は既定で auto-update が無効です(`/plugin` → Marketplaces で有効化可能)。有効にした場合でも、`compass` はバージョンをピン留めしているため、リリースで `version` を上げない限り更新は反映されません。

### Layout

各トップレベルディレクトリの中身は、このリポジトリ自身の [AGENTS.md](AGENTS.md) にある Map 表を参照してください。

### Update policy

週次巡回が一次情報に基づく更新案を作り、人間が全ての変更を承認します。レビューを経ずに `main` へ反映されることはありません。

### License

文書(practices、antipatterns、adapters、docs、この README の本文)は [CC BY 4.0](LICENSE-DOCS)、コード・スクリプト・スキーマ・テンプレート・スキル・設定は [MIT](LICENSE) です。どちらにも挙げていないパスは MIT です。短い逐語引用は原著作者に帰属し、検証のためにのみ掲載します。

### Contributing

[CONTRIBUTING.md](CONTRIBUTING.md) を参照してください。

### How this differs

全ての主張は出典と確認日にまで遡れます。もっともらしいだけの規則ではありません。内容はエージェントが行動する瞬間に読めるよう整理されており、人間が眺めるための wiki ではありません。内容を陳腐化させないのは、一度きりのレビューではなく繰り返し実行される検査です。
