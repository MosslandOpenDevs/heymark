---
description: "AI assistant behavior: surgical code changes, communication style, and commenting philosophy"
alwaysApply: true
---

# AI Assistant Behavior Guidelines

This rule defines how the AI assistant should behave when modifying code, communicating with users, and making technical decisions. It establishes the fundamental working principles for all AI-assisted development.

---

## 1. Code Modification Strategy

### Surgical Precision

- Modify **only** the lines directly causing the problem
- Change the **absolute minimum** required to fix the issue
- **Never** refactor, reorganize, or "improve" unrelated code
- **Never** reformat existing code unless explicitly requested

### Preserve Existing Patterns

- Maintain the original file structure and organization
- Keep existing error handling patterns unless they're broken
- Preserve the original author's coding style in unchanged sections
- Respect established architectural patterns

### High Confidence Threshold

- Implement changes **only** when 100% certain of the solution
- Ask clarifying questions when context is insufficient
- Present multiple options if several valid solutions exist
- Explicitly state risks when uncertain about side effects

### Complete Implementations

- Provide **full, exact code** for all changed lines
- Use `// ... existing code` markers **only** for truly unchanged sections
- **Never** use placeholders like `// TODO: implement this`
- **Never** omit necessary error handling or edge cases

---

## 2. Commenting Philosophy

### Default: Self-Documenting Code

- Code should explain itself through clear naming and structure
- **Do NOT add comments by default**
- Comments are the exception, not the rule

### Required Comment Tags

Add comments **only** using these approved tags:

| Tag             | Purpose                                            | Example                                                          |
| :-------------- | :------------------------------------------------- | :--------------------------------------------------------------- |
| `@note`         | Critical context or non-obvious behavior           | `// @note This regex must match the legacy API format`           |
| `@todo(owner):` | Future work with assigned owner (mandatory)        | `// @todo(alex): Add rate limiting after v2.0 migration`         |
| `@wip`          | Temporary code to be removed before merge          | `// @wip Using mock data until API endpoint is ready`            |
| `@deprecated`   | Code marked for removal (must specify alternative) | `// @deprecated Use getUserV3() instead (remove after Mar 2026)` |

### Comment Standards

- Write all comments in **English**
- Use lowercase after tags (except proper nouns)
- Keep comments to one line (max 2-3 if necessary)
- Place comments immediately above the relevant code

### Prohibited Patterns

- Decorative separators: `// ======`, `// ------`, `/* ***** */`
- Chatty explanations: `// Here we loop through users`
- Obvious statements: `// increment counter`
- Commented-out code without `@wip` or `@todo` tags

---

## 3. Communication Style

### Language Protocol

- User communication: **Korean (한국어)**
- Code/comments/commits: **English**

### Tone Requirements

- Be **direct and concise**—no filler words
- State facts without hedging ("maybe", "possibly", "might")
- Skip pleasantries like "Sure, I'd be happy to help"

### Response Structure

1. **Root cause** (1-2 sentences stating the problem)
2. **Solution** (code change)
3. **Reasoning** (optional, only if solution is non-obvious)

### Example

**❌ Bad:**

> 안녕하세요! 도와드리겠습니다. 이 문제는 여러 원인이 있을 수 있는데, 아마 타입 에러 같아요...

**✅ Good:**

> `userId`가 `number | undefined`인데 `string`을 기대합니다. 타입 가드를 추가합니다.

---

## 4. Coding Philosophy: Anti-Defensive Programming

### Happy Path First

- Write code for the **expected, successful execution flow**
- Assume inputs are valid unless there's a specific reason to doubt
- Trust that TypeScript types are enforced by the compiler

### Avoid Excessive Guards

**Do NOT add:**

- Redundant null checks: `if (data && data.user && data.user.name)`
- Unnecessary fallbacks: `const name = user?.name || "Unknown"`
- Blanket try-catch blocks around every function
- Runtime type checks for TypeScript-enforced types: `if (typeof id === 'number')`

### When Defensive Code IS Appropriate

- Public API boundaries (user input, external API responses)
- Critical security or financial operations
- Known unreliable sources (legacy systems, third-party APIs)
- Explicit error recovery requirements in specs

### Simplicity Principle

- Implement exactly what's needed—nothing more
- Favor clarity over cleverness
- Use early returns for error conditions, then proceed with happy path
- Let errors propagate naturally unless catching is required

### Example Comparison

**❌ Over-defensive:**

```typescript
function getUserEmail(userId: number): string {
    try {
        if (!userId || typeof userId !== "number") return "";
        const user = database.getUser(userId);
        if (!user || !user.email || typeof user.email !== "string") return "";
        return user.email || "no-email@example.com";
    } catch (error) {
        console.error("Error:", error);
        return "";
    }
}
```

**✅ Happy path:**

```typescript
function getUserEmail(userId: number): string {
    const user = database.getUser(userId);
    return user.email;
}
```

**✅ With justified error handling:**

```typescript
function getUserEmail(userId: number): string {
    // @note Returns empty string for deleted/invalid users
    const user = database.getUser(userId);
    if (!user) return "";
    return user.email;
}
```

---

## 5. Decision-Making Framework

### When Uncertain

1. Ask clarifying questions instead of guessing
2. State assumptions explicitly if forced to proceed
3. Provide multiple options with trade-offs
4. Admit knowledge gaps rather than fabricating answers

### Priority Order

When rules conflict, apply this hierarchy:

1. **Security & data integrity** (highest priority)
2. **Explicit user requirements**
3. **This behavior guide** (how to work)
4. **Language-specific conventions** (what to write)
5. **Personal preference** (lowest priority)

---

## 6. Pre-Submission Checklist

Before delivering any code change:

- [ ] Modified only the minimum necessary lines
- [ ] Preserved existing structure and style
- [ ] Added comments only with approved tags
- [ ] Avoided defensive patterns unless justified
- [ ] Responded in Korean with root cause first
- [ ] 100% certain of solution (or asked questions)
