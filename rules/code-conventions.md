---
description: "TypeScript and React naming conventions, file structure, and type patterns"
globs: "**/*.ts,**/*.tsx,**/*.js,**/*.jsx"
alwaysApply: true
---

# TypeScript & React Conventions

## File Naming

| Type              | Convention               | Example                |
| :---------------- | :----------------------- | :--------------------- |
| Utility / Service | `kebab-case.ts`          | `user-service.ts`      |
| React Component   | `PascalCase.tsx`         | `DashboardLayout.tsx`  |
| CSS Module        | `PascalCase.module.scss` | `Button.module.scss`   |
| Test              | `*.test.ts(x)`           | `user-service.test.ts` |
| Type Definition   | `*.types.ts`             | `api.types.ts`         |
| Constants         | `*.constants.ts`         | `routes.constants.ts`  |

## Code Naming

| Element        | Convention             | Example                  |
| :------------- | :--------------------- | :----------------------- |
| Variable       | `camelCase`            | `userName`, `isActive`   |
| Function       | `camelCase`            | `getUserData()`          |
| Constant       | `UPPER_SNAKE_CASE`     | `API_BASE_URL`           |
| Private member | `_camelCase`           | `_internalCache`         |
| Boolean        | `is/has/should` prefix | `isLoading`, `hasAccess` |
| Component      | `PascalCase`           | `UserCard`               |
| Hook           | `use` prefix           | `useAuth()`              |
| HOC            | `with` prefix          | `withAuth()`             |
| Event handler  | `handle` prefix        | `handleSubmit()`         |
| Render helper  | `render` prefix        | `renderHeader()`         |

## Types & Interfaces

| Type       | Convention              | Example                     |
| :--------- | :---------------------- | :-------------------------- |
| Interface  | `I` + PascalCase        | `IUser`, `IApiResponse`     |
| Type alias | `T` + PascalCase        | `TConfig`, `TRequestBody`   |
| Enum       | `E` + PascalCase        | `EUserRole`, `EStatus`      |
| Props      | ComponentName + `Props` | `ButtonProps`, `ModalProps` |
| Generic    | Single uppercase        | `T`, `K`, `V`               |

Usage: **Interface** → object shapes, **Type alias** → unions/intersections, **Enum** → fixed value sets (string values in `UPPER_CASE`)

```typescript
interface IUser {
    id: number;
    email: string;
    role: EUserRole;
}

type TApiResponse<T> = TSuccessResponse<T> | TErrorResponse;

enum EUserRole {
    Admin = "ADMIN",
    User = "USER",
    Guest = "GUEST",
}
```

- Avoid `any`; use `unknown` or generics
- Explicit return types for public API functions
- Use type guards for runtime narrowing

## File Structure

Import order (separate each group with a blank line):

1. React / framework (`react`, `next`)
2. External libraries (`axios`, `lodash`)
3. Internal aliases (`@/components`, `@/hooks`)
4. Relative imports (`./`, `../`)
5. Type-only imports (`import type`)
6. Styles (`.module.scss`)

Within-file order: **Imports → Types → Constants → Private helpers → Public exports**

## Component Pattern

```typescript
// Named function export (preferred over React.FC)
export function UserCard({ userId }: UserCardProps) {
    // 1. hooks
    // 2. state (descriptive names: isLoading, userData — not loading, data)
    // 3. effects (all deps in dependency array)
    // 4. handlers (handleXxx)
    // 5. render helpers (renderXxx)
    // 6. return JSX
}
```

## Formatting

- Max **100 characters** per line
- Prefer destructuring: `const { email, role } = user`
- Optional chaining `?.` max 2 levels deep
