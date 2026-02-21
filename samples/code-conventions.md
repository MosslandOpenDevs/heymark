---
description: TypeScript and React conventions for naming, types, structure, and formatting
globs: "**/*.ts,**/*.tsx,**/*.js,**/*.jsx"
alwaysApply: false
---

# TypeScript & React Conventions

## File Naming

- Use `kebab-case` for utilities, services, and non-component modules
- Use `PascalCase.tsx` for React component files
- Use `PascalCase.module.scss` for component-scoped styles
- Use `*.test.ts` or `*.test.tsx` for test files
- Use `*.types.ts` and `*.constants.ts` for shared type and constant modules

## Code Naming

- Use `camelCase` for variables and functions
- Use `UPPER_SNAKE_CASE` for true constants
- Use `PascalCase` for React components and class names
- Prefix hooks with `use`, handlers with `handle`, render helpers with `render`, and booleans with `is`, `has`, or `should`
- Avoid abbreviations unless they are standard in the domain

## Types and Interfaces

| Type       | Convention                | Example                     |
| ---------- | ------------------------- | --------------------------- |
| Interface  | `I` + PascalCase          | `IUser`, `IApiResponse`     |
| Type alias | `T` + PascalCase          | `TConfig`, `TRequestBody`   |
| Enum       | `E` + PascalCase          | `EUserRole`, `EStatus`      |
| Props      | `ComponentName` + `Props` | `ButtonProps`, `ModalProps` |
| Generic    | Single uppercase          | `T`, `K`, `V`               |

- Use the table above as the canonical naming contract for type symbols
- Use `unknown` or generics instead of `any`
- Add explicit return types to public exported APIs
- Keep enum member values stable and descriptive

## Clean Code Rules

- Replace magic numbers and hard-coded literals with named constants
- Keep constants close to usage or in dedicated constant modules
- Keep related code together and preserve a clear module hierarchy
- Hide implementation details and expose minimal public interfaces
- Use self-documenting code before adding comments

## Function Design

- Keep each function focused on a single responsibility
- Extract repeated logic into reusable functions or hooks
- Split functions that require explanatory comments for behavior
- Move deeply nested conditionals into well-named helper functions
- Prefer explicit control flow and early returns for error paths

## Import and File Structure

- Group imports with one blank line between groups
- Use this import order: framework -> external -> internal alias -> relative -> type-only -> styles
- Keep file order consistent: imports -> types -> constants -> helpers -> exports
- Keep one public responsibility per file and split oversized modules
- Preserve stable module boundaries; avoid cross-layer imports

## Component Pattern

- Use named function components instead of `React.FC`
- Order internals consistently: hooks -> state -> effects -> handlers -> helpers -> return
- Keep handler names explicit and side-effect boundaries clear
- Keep components focused; extract repeated logic into hooks
- Keep JSX simple; move complex conditionals into helpers

## Formatting

- Keep line length to 100 characters or fewer
- Prefer destructuring for repeated property access
- Limit optional chaining depth; refactor deeply nested access
- Keep one statement intent per line

## Comments, Testing, and Maintenance

- Add comments only for non-obvious intent, constraints, or side effects
- Do not add comments that restate obvious code behavior
- Write or update tests when fixing bugs or changing critical logic
- Cover edge cases and error paths in tests
- Leave touched code cleaner than before without broad unrelated refactors
