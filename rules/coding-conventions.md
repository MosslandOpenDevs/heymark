---
description: "TypeScript & React coding standards, naming conventions, and commenting rules"
globs: "**/*.ts,**/*.tsx,**/*.js,**/*.jsx"
alwaysApply: true
---

# TypeScript & React Coding Standards

This document defines the naming conventions and commenting standards for this project. Adhere to these rules strictly when generating or refactoring code.

---

## 1. Naming Conventions

### Files

- **Common files:** `kebab-case.ts` (e.g., `user-service.ts`)
- **Components:** `PascalCase.tsx` (e.g., `DashboardPage.tsx`)
- **SCSS Modules:** `PascalCase.module.scss` (e.g., `Card.module.scss`)

### Code

- **Functions/Variables:** `camelCase` (e.g., `getUserData`)
- **Constants:** `UPPER_SNAKE_CASE` (e.g., `API_BASE_URL`)
- **Components:** `PascalCase` (e.g., `UserCard`)
- **Private members:** Prefix with `_` (e.g., `_privateMethod`)

### Types & Interfaces

- **Interfaces:** `I + PascalCase` (e.g., `IUser`) or descriptive name (`UserInfo`)
- **Type Aliases:** `T + PascalCase` (e.g., `TConfig`)
- **Enums:** `E + PascalCase` (e.g., `EUserRole`)
- **Props:** `<ComponentName>Props` (e.g., `ButtonProps`)
- **Generics:** `T`, `K`, `V` or meaningful names (e.g., `TResponse`)

---

## 2. Comments & Documentation

### General Rules

- Use **JSDoc** for complex logic/functions or concise `//` for simple explanations.
- **Strictly prohibited:** Separator comments like `// ============`.

### Comment Tags

Use the following tags for team collaboration. The tag must be the **first token** in the comment.

| Tag                | Usage                                  | Example                                           |
| :----------------- | :------------------------------------- | :------------------------------------------------ |
| **`@note`**        | Important context, warnings, or intent | `// @note Caching required due to API rate limit` |
| **`@todo(owner)`** | Follow-up work (owner required)        | `// @todo(john): add validation logic`            |
| **`@wip`**         | Temporary code (remove before merge)   | `// @wip Temporary mock data`                     |
| **`@deprecated`**  | Deprecated code (specify alternative)  | `/** @deprecated Use fetchUserV2() instead */`    |

---

## 3. Formatting

- Single line: `// @tag ...`
- Multiple lines: `/** @tag ... */`
