# heymark

> **Hey, Mark it down!**  
> A documentation system designed for agentic AI workflows.

## Overview

heymark is a markdown-centric documentation system for AI-augmented development. It integrates with AI tools such as Claude Skill so developers can create, organize, and share documentation with minimal friction.

### Rationale

In AI-driven workflows, well-structured markdown is a high-value, token-efficient asset. Systems like Claude Skill use frontmatter to select and surface relevant documents. heymark supports this with CLI tooling, Git-backed versioning, and frontmatter-based access control.

## Tech Stack

| Layer    | Technologies                                                   |
| -------- | -------------------------------------------------------------- |
| Frontend | Next.js (App Router), React, TypeScript, SCSS Modules, Zustand |
| Backend  | Next.js API Routes, server utilities, GitHub API               |
| CLI      | Node.js, Commander, Chalk, Gray Matter                         |

## Features

- **CLI-driven document management** — Create and publish from the terminal
- **Frontmatter-based access control** — Public/private visibility and email-based sharing
- **Git-backed versioning** — Change history and rollback via the posts repository
- **Automatic table of contents** — TOC and anchors from markdown headings
- **Admin tools** — Delete, visibility, and sharing management

## Run locally

```bash
yarn install
cp .env.example .env.local  # edit with your values
yarn dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Documentation

- [Contributing Guide](CONTRIBUTING.md)
- [Frontend Guide](README.frontend.md)
- [Backend Guide](README.backend.md)
- [CLI Guide](README.cli.md)
