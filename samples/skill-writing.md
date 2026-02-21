---
description: Skill and Rule Writing Standards
globs: "**/*.{md,mdc}"
alwaysApply: false
---

# Rule Writing Standards

Write rules that AI can execute immediately without interpretation gaps.

## Frontmatter Contract

- Start every rule with YAML frontmatter
- Include `description`, `globs`, and `alwaysApply` in every rule
- Use `description` as a one-line activation summary
- Set `alwaysApply: true` only for global, session-wide rules
- Set `alwaysApply: false` only for file-scoped rules
- Leave `globs` empty only when `alwaysApply: true`

## Activation Patterns

- Use exactly one of these two patterns
- Do not mix global and file-scoped behavior in one rule

```yaml
---
description: Global rule loaded in every session
globs:
alwaysApply: true
---
```

```yaml
---
description: File-scoped rule loaded for matching files
globs: "src/**/*.ts"
alwaysApply: false
---
```

## Rule Body Structure

- Use one short `#` title that matches the rule intent
- Split into small `##` sections with one concern per section
- Keep each section to 3-5 actionable bullets
- Prefer bullets over paragraphs
- Use examples only for non-obvious or easy-to-misapply rules

## Writing Style

- Write the rule document in English only
- Use imperative voice, and start each instruction with a base-form verb such as `Use`, `Keep`, `Remove`, `Verify`
- Prefer direct imperatives like `Use ...` instead of subject-first forms like `You must use ...`
- Keep one bullet to one instruction, and use concrete verbs such as `rename`, `extract`, `remove`, `keep`
- Use explicit constraints such as `must`, `never`, `always` only when they add precision
- Remove vague words such as `try`, `consider`, `appropriately`, `etc.`
- Remove paraphrased duplicates that restate the same instruction
- Keep instructions short and scannable in one pass

## Content Rules

- Verify facts before writing guidance
- Do not invent conventions not agreed by the project
- Preserve existing behavior unless change is explicitly requested
- Keep terminology consistent across the document
- Keep each instruction in one section only
- Exclude filler text, apologies, and self-evaluation statements
- Exclude suggestions unrelated to the requested task
- Avoid unstable path references unless required for scope

## Final Validation

- Frontmatter has valid `description`, `globs`, `alwaysApply`
- `alwaysApply` and `globs` do not conflict
- Document body is English-only
- Every instruction starts with an imperative verb
- Rule is executable without extra clarification
- No conflicting or duplicated instructions remain
- Document is concise enough for frequent automatic loading
