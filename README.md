# Heymark

Heymark is a tool that manages Skill documentation for AI coding tools in a single location and automatically converts it into each tool format.  
A Markdown source written once can be reused across multiple agent tools.

1. [Overview](#overview)
2. [Features](#features)
3. [Supported Agent Tools](#supported-agent-tools)
4. [Tech Stack](#tech-stack)
5. [Heymark Usage](#heymark-usage)
6. [Heymark Development](#heymark-development)

## Overview

Managing Skill files separately for each AI tool leads to fragmented documentation and higher maintenance costs.  
Heymark follows the Single Source of Truth principle and converts one Markdown source into multiple tool formats.  
A Skill written once can be used immediately in Cursor, Claude Code, GitHub Copilot, OpenAI Codex, and Antigravity.

## Features

- Single source management: Manage Skills for multiple AI tools with one Markdown file
- Automatic format conversion: Convert into each tool's native format (YAML frontmatter, AGENTS.md, etc.)
- Selective conversion: Convert only the tools you need
- NPM package distribution: Run with `npx` without installation
- Plugin structure: Extend supported tools by adding conversion modules

## Supported Agent Tools

| Tool        | Output Format                            | Key Features                                             |
| :---------- | :--------------------------------------- | :------------------------------------------------------- |
| Cursor      | `.cursor/rules/*.mdc`                    | YAML frontmatter (`description`, `globs`, `alwaysApply`) |
| Claude Code | `.claude/skills/*/SKILL.md`              | Skill directory structure + YAML frontmatter             |
| Copilot     | `.github/instructions/*.instructions.md` | Multi-pattern mapping via `applyTo`                      |
| Codex       | `.agents/skills/*/SKILL.md`              | Skill directory structure + YAML frontmatter             |
| Antigravity | `.agent/skills/*/SKILL.md`               | Skill directory structure + YAML frontmatter             |

## Tech Stack

- Runtime: Node.js
- Language: JavaScript
- Core: File system API, YAML frontmatter parsing

## Heymark Usage

### 1. Prepare the Skill Markdown Archive Repository

Create Markdown files in a Skill source directory (external or personal GitHub repository) and define metadata with YAML frontmatter.

```markdown
---
description: "AI assistant behavior guidelines"
globs: "**/*.ts,**/*.tsx"
alwaysApply: true
---

# Skill Title

Skill content...
```

You can keep the repository structure simple, as shown below.

```text
my-skills-repository/
  ai-behavior.md
  code-conventions.md
  api-skills.md
```

Skill sources are read from a remote GitHub repository (Public/Private).

### 2. Initial Setup

For first-time use, configure the Skill source repository once.

```bash
# Configure Skill source (.heymark/config.json will be created)
npx heymark init <GitHub-Repository-URL>
```

```bash
# HTTPS (for private repositories, Git credentials/token setup is required)
npx heymark init https://github.com/org/my-rules.git

# SSH (recommended for private repositories)
npx heymark init git@github.com:org/my-rules.git

# When .md files are in a subdirectory of the repository
npx heymark init https://github.com/org/my-rules.git --dir rules --branch main
```

### 3. Run

You can run it directly with `npx` without installation.  
Skills are fetched from an external GitHub repository, and Markdown files in that repository are converted into each AI tool format and generated in the current project.

```bash
# Fetch from the external Skill repository configured in .heymark/config.json and convert to all tool formats
# (delete previously generated files and recreate them)
npx heymark

# Use a different external repository for this run only (ignore .heymark/config.json)
npx heymark --source https://github.com/org/other-rules.git

# Convert only specific tools
npx heymark -t cursor,claude

# Preview (check conversion result without creating files)
npx heymark --preview

# Delete tool-specific files generated previously
npx heymark --clean

# CLI help
npx heymark --help
```

## Heymark Development

### 1. Local Execution

```bash
# Configure Skill source (first-time only, GitHub repository URL)
node scripts/sync.js init https://github.com/org/my-rules.git

# Convert to all tool formats
node scripts/sync.js

# Use a different repository for this run only
node scripts/sync.js --source https://github.com/org/other-rules.git

# Convert only specific tools
node scripts/sync.js -t cursor,claude

# Preview (check without creating files)
node scripts/sync.js --preview

# Delete generated files
node scripts/sync.js --clean
```

### 2. Release

```bash
# NPM login
npm login
# Username: your-npm-username
# Email: your-email@example.com

# 1. Test after updating Skills
node scripts/sync.js --preview

# 2. Update version (Git tag is created automatically)
npm version patch  # or minor, major

# 3. Push to GitHub
git push --follow-tags  # push commits and tags together

# 4. Publish to NPM
npm publish
```

### 3. Versioning

- `patch` (1.0.0 -> 1.0.1): Bug fixes, typo fixes
- `minor` (1.0.0 -> 1.1.0): New Skills, feature improvements
- `major` (1.0.0 -> 2.0.0): Breaking changes
- The `npm version` command automatically creates a Git tag.
- `git push --follow-tags` pushes normal commits and tags together. (Recommended)
- Alternatively, you can run `git push && git push --tags` to push commits first and then push all tags separately.
