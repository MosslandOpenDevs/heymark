---
description: "Guide for creating rule documents: structure, token efficiency, and writing principles"
globs: "rules/*.md"
alwaysApply: false
---

# Rule Writing Guide

Rules in `rules/` are consumed by AI coding assistants. Every token loads per request — **brevity is critical**.

## Frontmatter

```yaml
---
description: "One-line summary for AI relevance judgment"
globs: "**/*.ts,**/*.tsx" # File patterns for auto-attachment (empty if N/A)
alwaysApply: true # true = always loaded, false = conditional
---
```

- `description`: AI가 자동 로딩 여부를 판단할 때 참조하는 요약
- `globs`: 해당 파일 패턴 작업 시 자동 적용
- `alwaysApply`: 항상 로드 여부

## Structure

1. **Title** (`# Rule Name`) — short, descriptive
2. **Scope** (optional) — one sentence on when this rule activates
3. **Sections** — organized by theme
4. No redundant sections (stated rules should not be restated as checklists)

## Writing Principles

### Token Efficiency

- Every line must be an **actionable instruction**
- Remove meta-sentences: ~~"This rule defines how the AI should..."~~
- Remove knowledge AI already possesses
- **Tables** for mappings (most token-efficient format)
- **Bullet lists** for constraints, not paragraphs
- One code example per concept max; omit if a table already conveys it

### Clarity

- **Imperative voice:** "Use camelCase" not "You should use camelCase"
- **Bold** key terms and constraints
- Concrete examples over abstract descriptions
- No hedging: use "always", "never", "must" — not "try to", "consider"

### Completeness

- Cover all conventions without redundancy
- Include ✅/❌ examples only when the rule is counterintuitive
- Add inline context only when the rule needs explanation

## Anti-Patterns

- Chatty introductions: ~~"Welcome! This document will help you..."~~
- Redundant checklists restating earlier rules
- Over-documenting _why_ a rule exists (unless non-obvious)
- Emojis, excessive separators, decorative formatting
- Stale references to specific file names or paths that change frequently

## Quality Test

A well-written rule document:

- Can be followed by any AI without ambiguity
- Contains **zero** filler sentences
- Uses ≤50% tokens of a verbose equivalent
- Handles edge cases inline, not in separate sections
