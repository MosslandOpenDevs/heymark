# Heymark

For the Korean version, see [README.ko.md](README.ko.md).

Heymark is a hub system that converts and syncs one Skill repository into multiple AI Tool formats.

1. [Overview](#overview)
2. [Features](#features)
3. [Supported Tools](#supported-tools)
4. [How to Use](#how-to-use)
5. [How to Dev](#how-to-dev)

## Overview

AI Tools support loading context-aware Skills to reduce repetitive instruction typing.
This helps standardize common tasks and keeps team workflows consistent.
However, each project still needs separate Skill linking and management, and each AI Tool requires a
different Skill file format, so the same content is often maintained multiple times.
Heymark automates format conversion and sync around a single Skill repository (Single Source of Truth),
reducing repetitive operational work and maximizing AI workflow efficiency.

## Features

- Single source management: Manage Markdown-based Skills in one place
- Automatic format conversion: Generate Skill outputs in each tool's required format
- Selective sync: Sync all tools or only selected tools
- Instant sample usage: Start immediately with `npx heymark link --samples` without preparing a Skill repo

## Supported Tools

| Tool           | Output Format                            |
| :------------- | :--------------------------------------- |
| Cursor         | `.cursor/rules/*.mdc`                    |
| Claude Code    | `.claude/skills/*/SKILL.md`              |
| GitHub Copilot | `.github/instructions/*.instructions.md` |
| OpenAI Codex   | `.agents/skills/*/SKILL.md`              |
| Antigravity    | `.agent/skills/*/SKILL.md`               |

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
npx heymark link --samples # quickly link sample Skills
npx heymark sync .
```

### Commands

```bash
npx heymark link --samples # quickly link sample Skills

npx heymark link <GitHub-Repository-URL> # link a Skill repository
npx heymark link <GitHub-Repository-URL> --folder <folder-name> # when using a subfolder
npx heymark link <GitHub-Repository-URL> --branch <branch-name> # when using another branch

npx heymark sync . # sync all tools
npx heymark sync cursor claude # sync selected tools

npx heymark clean . # clean all generated outputs
npx heymark clean cursor claude # clean selected tool outputs

npx heymark status # check status (same as running npx heymark)
npx heymark help # show command help
```

## How to Dev

### Tech Stack

- Runtime: Node.js
- Language: JavaScript
- Core: File system API, YAML frontmatter parsing

### Local Development

Replace `npx heymark` in the `How to Use` section with `node scripts/cli.js` for local runs.

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
