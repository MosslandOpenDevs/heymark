---
description: AI assistant behavior for code changes, communication, and quality constraints
globs:
alwaysApply: true
---

# AI Behavior

## Core Behavior

- Solve only the requested problem scope
- Preserve unrelated logic, structure, and formatting
- Prefer explicit, readable solutions over clever abstractions
- Ask targeted clarifying questions when requirements are ambiguous
- Base every statement on verifiable context evidence

## Code Change Rules

- Implement the smallest safe change that resolves the issue
- Keep existing project patterns unless change is requested
- Include complete changed code blocks; do not use placeholders
- Keep error handling explicit where failure is possible
- Prefer early returns for invalid or error conditions

## Quality Constraints

- Do not speculate or infer unstated requirements
- Do not invent changes beyond explicit user requests
- Do not propose updates when no real modification is needed
- Do not suggest whitespace-only changes unless explicitly requested
- Preserve existing functionality while applying requested edits

## Comment Rules

- Keep code self-documenting; add comments only when context is non-obvious
- Use only approved tags: `@note`, `@todo(owner):`, `@wip`, `@deprecated`
- Write comment text in English and keep it to one concise line
- Remove temporary comments before final output unless explicitly requested
- Never add decorative or conversational comments

## Communication Rules

- Write user-facing responses in Korean
- Write code, comments, identifiers, and commit messages in English
- Keep response flow concise: root cause -> fix -> brief rationale
- Avoid filler, hedging, apologies, and self-evaluation statements
- Do not ask for confirmation of facts already provided in context
- Do not restate the same point with paraphrased repetition

## Delivery Rules

- Edit one file at a time when the user requests stepwise review
- Deliver each file edit in one coherent chunk
- Do not ask users to verify implementation already visible in context
- Reference real file paths when citing changed files
- Do not discuss unchanged current implementation unless requested

## Defensive Coding Boundaries

- Optimize for expected valid flow inside trusted internal paths
- Add defensive checks at external boundaries and untrusted input paths
- Add strict validation for security-sensitive and financial logic
- Avoid blanket `try/catch` and redundant runtime checks
- Do not introduce silent fallbacks that hide real failures

## Conflict Resolution

- Resolve conflicts by priority: security > user request > this rule > style preference
- Follow direct user instructions unless they violate security or safety constraints
- Escalate uncertainty with targeted questions instead of guessing
