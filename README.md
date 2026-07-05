# Heymark

For the Korean version, see [README.ko.md](README.ko.md).

> **Status — Archived (2026-07).** Heymark is no longer actively developed and is kept as a reference implementation. See [ARCHIVE.md](ARCHIVE.md) for the wind-down rationale, the mid-2026 landscape analysis, what was fixed in the final pass, and known limitations.

Heymark is a hub system that converts and syncs one Skill repository into multiple AI Tool formats.

1. [Overview](#overview)
2. [Features](#features)
3. [Supported Tools](#supported-tools)
4. [How to Use](#how-to-use)
5. [How to Dev](#how-to-dev)
6. [Future Directions](#future-directions)

## Overview

AI Tools support loading context-aware Skills to reduce repetitive instruction typing.
This helps standardize common tasks and keeps team workflows consistent.
However, each project still needs separate Skill linking and management, and each AI Tool requires a
different Skill file format, so the same content is often maintained multiple times.
Heymark automates format conversion and sync around a single Skill repository (Single Source of Truth),
reducing repetitive operational work and maximizing AI workflow efficiency.

<img width="600" alt="image" src="https://github.com/user-attachments/assets/3819f0d7-9bb2-474f-a58a-da3d1344207d" />

_This shows Skills being automatically loaded based on prompt context._

## Features

- Single source management: Manage Markdown-based Skills in one place
- Automatic format conversion: Generate Skill outputs in each tool's required format
- Selective sync: Sync all tools or only selected tools
- Sample skills: Try instantly with the heymark sample skill repo

## Supported Tools

| Tool        | CLI usage     | Output Format                            |
| :---------- | :------------ | :--------------------------------------- |
| Cursor      | `cursor`      | `.cursor/rules/*.mdc`                    |
| Claude Code | `claude-code` | `.claude/skills/*/SKILL.md`              |
| Copilot     | `copilot`     | `.github/instructions/*.instructions.md` |
| Codex       | `codex`       | `.agents/skills/*/SKILL.md`              |
| Antigravity | `antigravity` | `.agents/skills/*/SKILL.md`              |
| OpenClaw    | `openclaw`    | `~/.openclaw/skills/*/SKILL.md`          |

## How to Use

### Prepare Skill Repository

You can organize your Skill repository like this:

```text
my-skills-repository/
  ai-behavior.md
  code-conventions.md
  api-skills.md
```

Each Skill Markdown file should include frontmatter:

```markdown
---
description: "AI coding behavior guidelines"
globs: "**/*.ts,**/*.tsx"
alwaysApply: true
---

# Skill Title

Skill content...
```

### Quick Start

```bash
npx heymark link https://github.com/MosslandOpenDevs/heymark.git --folder skill-samples
npx heymark sync .
```

_After `link` and `sync`, Skill files are generated in each tool's expected directory._

<img width="250" alt="image" src="https://github.com/user-attachments/assets/0e5bc974-12d6-4aab-b0aa-16ca5659f973" />

### Commands

```bash
npx heymark link <GitHub-Repository-URL>
npx heymark link <GitHub-Repository-URL> --folder <folder-name>
npx heymark link <GitHub-Repository-URL> --branch <branch-name>

npx heymark sync .                        # sync all tools
npx heymark sync cursor claude-code       # sync selected tools

npx heymark clean .                       # clean all generated outputs
npx heymark clean cursor claude-code      # clean selected tool outputs

npx heymark help
```

## How to Dev

### Tech Stack

- Runtime: Node.js
- Language: JavaScript
- Core: File system API, custom Markdown frontmatter parser (simple `key: value` scalars; not full YAML)

### Local Development

Replace `npx heymark` in the `How to Use` section with `node src/index.js` for local runs.

### Release

```bash
npm login
npm version patch  # or minor, major
git push --follow-tags
npm publish
```

### Versioning

- `patch` (1.0.0 -> 1.0.1): Bug fixes, typo fixes
- `minor` (1.0.0 -> 1.1.0): New Skills, feature improvements
- `major` (1.0.0 -> 2.0.0): Breaking changes

## Future Directions

The v2.1.1 pass made the reference implementation correct, but not relevant — the premise still needs a new wedge. If you pick this up, the first thing to get right is what _not_ to do: **stop competing on tool-count.** That axis is already owned — `rulesync` (40+ tools) and `Ruler` (~31) — and with `SKILL.md` and `AGENTS.md` now open standards, a seventh or eighth target buys almost nothing.

That leaves two genuinely different directions. They are a fork, not a roadmap — pick one.

- **A — Standards-first converter.** Adopt `AGENTS.md` + portable `SKILL.md` as the baseline and translate _only_ the true outliers — Cursor `.mdc`, Copilot `.instructions.md`, plus path re-rooting. Cheap to prototype; low ceiling.
- **B — Distribution / governance.** Lean into `link <repo>`: one team publishes a governed skill repo, every project and tool pulls from it — with versioning, provenance, and drift detection. Bigger surface, unproven demand.

A is format work; B is workflow work. They don't compose cleanly.

Either way the prerequisites are the same. The tool-plugin contract (`src/tools/<name>/index.js`) makes targets cheap to add or drop, so start there, in order:

1. Restore tests + CI — `CONTRIBUTING.md` mandates them, and every v2.1.1 bug was deterministic.
2. Add an `AGENTS.md` target — the standard baseline Heymark still lacks.
3. Write a real YAML frontmatter parser (the current one handles only single-line `key: value`).
4. Make OpenClaw consistent with the other targets; optionally restore `status` / `validate` / `--json`.

The single-source-of-truth instinct was right. Whether the winning shape is a tiny translator or a distribution layer is the open question — and an open invitation. See [ARCHIVE.md](ARCHIVE.md) §5 for the full landscape and the honest case for why neither may be worth it.
