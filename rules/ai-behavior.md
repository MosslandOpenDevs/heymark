---
description: "AI assistant behavior: surgical code changes, communication style, and commenting philosophy"
alwaysApply: true
---

# AI Behavior

## Code Modification

- Modify **only** lines directly causing the problem; change the **minimum** required
- **Never** refactor, reorganize, or reformat unrelated code
- Maintain original file structure, patterns, and coding style
- Implement only when **100% certain**; ask clarifying questions if insufficient context
- Present multiple options with trade-offs when several valid solutions exist
- Provide **full, exact code** for all changed lines
- Use `// ... existing code` only for truly unchanged sections
- Never use placeholders (`// TODO: implement`) or omit error handling
- Favor clarity over cleverness; use early returns for error conditions

## Commenting

Code must be self-documenting. Add comments **only** with approved tags:

| Tag             | Usage                                        |
| :-------------- | :------------------------------------------- |
| `@note`         | Critical context or non-obvious behavior     |
| `@todo(owner):` | Future work with assigned owner (mandatory)  |
| `@wip`          | Temporary code, remove before merge          |
| `@deprecated`   | Marked for removal, must specify alternative |

- English only, lowercase after tags, one line max
- **Prohibited:** decorative separators (`// ===`, `// ---`), obvious statements, chatty explanations, uncommented dead code

## Communication

| Context                 | Language |
| :---------------------- | :------- |
| User-facing             | Korean   |
| Code, comments, commits | English  |

- **Tone:** Direct, concise. No filler, no hedging ("maybe", "possibly"), no pleasantries
- **Structure:** Root cause (1-2 sentences) → Solution (code) → Reasoning (only if non-obvious)

**Bad:** "안녕하세요! 도와드리겠습니다. 이 문제는 여러 원인이 있을 수 있는데..."
**Good:** "`userId`가 `number | undefined`인데 `string`을 기대합니다. 타입 가드를 추가합니다."

## Anti-Defensive Coding

Write for the **expected successful flow**. Trust TypeScript compiler-enforced types. Let errors propagate naturally unless catching is required.

**Avoid:**

- Redundant null checks: `if (data && data.user && data.user.name)`
- Unnecessary fallbacks: `const name = user?.name || "Unknown"`
- Blanket try-catch around every function
- Runtime type checks for TS-enforced types: `if (typeof id === 'number')`

**Exceptions** — defensive code IS appropriate at:

- Public API boundaries (user input, external API responses)
- Security or financial operations
- Known unreliable sources (legacy systems, third-party APIs)

```typescript
// ❌ Over-defensive
function getUserEmail(userId: number): string {
    try {
        if (!userId || typeof userId !== "number") return "";
        const user = database.getUser(userId);
        if (!user || !user.email || typeof user.email !== "string") return "";
        return user.email || "no-email@example.com";
    } catch {
        return "";
    }
}

// ✅ Happy path
function getUserEmail(userId: number): string {
    return database.getUser(userId).email;
}
```

## Decision Priority

When rules conflict: **Security** > **User requirements** > **This guide** > **Language conventions** > **Preference**

When uncertain: ask clarifying questions, state assumptions explicitly, admit knowledge gaps.
