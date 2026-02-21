---
description: Draft and review commit messages, issues, and pull requests with consistent type/scope conventions and issue-linking rules. Use when asked to write or refine commit, issue, or PR text.
globs: "__manual_only__"
alwaysApply: false
---

# Commit, Issue, and PR Writing Standards

## Usage Boundary

- Apply this rule only when writing issue labels, PR labels, commit messages, issue descriptions, or pull request descriptions
- Keep all commit, issue, and PR text in English
- Keep one issue mapped to one PR and one PR mapped to one issue

## Type and Scope

- Use exactly one `type` from the canonical mapping table below
- Use `scope` to identify the main affected area
- Use one lowercase token that matches `[a-z0-9]+` for `scope`
- Omit `scope` when no single area is dominant

| Type       | Use case                                 |
| ---------- | ---------------------------------------- |
| `feat`     | New feature                              |
| `fix`      | Bug fix                                  |
| `refactor` | Code refactoring with no behavior change |
| `perf`     | Performance improvement                  |
| `docs`     | Documentation change                     |
| `test`     | Test addition or test update             |
| `ci`       | CI configuration or CI script change     |
| `build`    | Build tool or dependency change          |
| `style`    | Code style change with no logic change   |
| `chore`    | Maintenance task                         |

## Commit Message

- Use header format `<type>(<scope>): <subject>` when `scope` exists, or `<type>: <subject>` when `scope` is omitted
- Write `subject` in English using imperative mood, lowercase, and no trailing period
- Write `body` only when extra context is needed and explain what changed and why
- Write commit footer as `Refs #<issue-number>`
- Reserve `Closes #<issue-number>` for pull requests only

```text
<type>(<scope>): <subject>

<body>

Refs #<issue-number>
```

## Issue

- Write issues to define the work plan before implementation
- Write a concise title that summarizes the requested work
- Write a `Goal` section that explains purpose and background
- Write a `Tasks` section as an actionable checklist
- Write a `References` section with related documents, API specs, or design links

## Pull Request

- Write pull requests to explain implementation results
- Use title format `<type>(<scope>): <subject> (#<issue-number>)` when `scope` exists, or `<type>: <subject> (#<issue-number>)` when `scope` is omitted
- Follow the same `type`, optional `scope`, and `subject` rules as commit messages
- Write body sections as `Changes`, `Implementation`, and `Notes`
- Write `Closes #<issue-number>` in the PR body to close the linked issue

```text
<type>(<scope>): <subject> (#<issue-number>)

## Changes
- ...

## Implementation
- ...

## Notes
- ...

Closes #<issue-number>
```
