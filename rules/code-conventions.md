---
description: "TypeScript and React naming conventions, file structure, and type patterns"
globs: "**/*.ts,**/*.tsx,**/*.js,**/*.jsx"
alwaysApply: true
---

# TypeScript & React Conventions

This rule defines the naming conventions, file organization, and type patterns for TypeScript and React projects.

---

## 1. File Naming

| File Type       | Convention               | Example                |
| :-------------- | :----------------------- | :--------------------- |
| Utility/Service | `kebab-case.ts`          | `user-service.ts`      |
| React Component | `PascalCase.tsx`         | `DashboardLayout.tsx`  |
| CSS Module      | `PascalCase.module.scss` | `Button.module.scss`   |
| Test File       | `*.test.ts(x)`           | `user-service.test.ts` |
| Type Definition | `*.types.ts`             | `api.types.ts`         |
| Constants       | `*.constants.ts`         | `routes.constants.ts`  |

---

## 2. Code Naming

### Variables & Functions

| Element          | Convention             | Example                                  |
| :--------------- | :--------------------- | :--------------------------------------- |
| Variable         | `camelCase`            | `userName`, `isActive`                   |
| Function         | `camelCase`            | `getUserData()`, `validateEmail()`       |
| Constant         | `UPPER_SNAKE_CASE`     | `API_BASE_URL`, `MAX_RETRY_COUNT`        |
| Private member   | `_camelCase`           | `_internalCache`, `_validate()`          |
| Boolean variable | `is/has/should` prefix | `isLoading`, `hasAccess`, `shouldRender` |

### React Components

| Element         | Convention      | Example                          |
| :-------------- | :-------------- | :------------------------------- |
| Component       | `PascalCase`    | `UserCard`, `AppLayout`          |
| Hook            | `use` prefix    | `useAuth()`, `useFetch()`        |
| HOC             | `with` prefix   | `withAuth()`, `withTheme()`      |
| Render function | `render` prefix | `renderHeader()`, `renderItem()` |

---

## 3. TypeScript Types & Interfaces

### Naming Conventions

| Type              | Convention              | Example                     |
| :---------------- | :---------------------- | :-------------------------- |
| Interface         | `I` + PascalCase        | `IUser`, `IApiResponse`     |
| Type Alias        | `T` + PascalCase        | `TConfig`, `TRequestBody`   |
| Enum              | `E` + PascalCase        | `EUserRole`, `EStatus`      |
| Component Props   | ComponentName + `Props` | `ButtonProps`, `ModalProps` |
| Generic Parameter | Single uppercase letter | `T`, `K`, `V`               |

### Type Definition Patterns

**Interfaces for object shapes:**

```typescript
interface IUser {
    id: number;
    email: string;
    role: EUserRole;
}
```

**Type aliases for unions/intersections:**

```typescript
type TApiResponse<T> = TSuccessResponse<T> | TErrorResponse;
type TConfig = IBaseConfig & IFeatureFlags;
```

**Enums for fixed sets:**

```typescript
enum EUserRole {
    Admin = "ADMIN",
    User = "USER",
    Guest = "GUEST",
}
```

**Props with optional children:**

```typescript
interface ButtonProps {
    variant?: "primary" | "secondary";
    onClick: () => void;
    children: React.ReactNode;
}
```

---

## 4. File Structure

### Component File Structure

```typescript
// 1. External imports
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// 2. Internal imports (by proximity)
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/Button';

// 3. Types
interface UserCardProps {
  userId: number;
  onUpdate: () => void;
}

// 4. Constants
const MAX_DISPLAY_LENGTH = 50;

// 5. Component
export function UserCard({ userId, onUpdate }: UserCardProps) {
  // hooks
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // effects
  useEffect(() => {
    // ...
  }, [userId]);

  // handlers
  const handleEdit = () => {
    setIsEditing(true);
  };

  // render helpers
  const renderUserInfo = () => {
    // ...
  };

  // main render
  return <div>{renderUserInfo()}</div>;
}
```

### Service/Utility File Structure

```typescript
// 1. Imports
import axios from "axios";

// 2. Types
interface IFetchOptions {
    timeout?: number;
}

// 3. Constants
const DEFAULT_TIMEOUT = 5000;

// 4. Private helpers
function _buildHeaders(token?: string) {
    // ...
}

// 5. Public API
export async function fetchUser(id: number, options?: IFetchOptions) {
    // ...
}
```

---

## 5. Import Organization

### Order

1. **React/framework** (`react`, `next`, `vue`)
2. **External libraries** (`axios`, `lodash`, `date-fns`)
3. **Internal aliases** (`@/components`, `@/hooks`, `@/utils`)
4. **Relative imports** (`./UserCard`, `../utils`)
5. **Types** (`import type { ... }`)
6. **Styles** (`.module.scss`, `.css`)

### Grouping

```typescript
// React core
import React, { useState, useCallback } from "react";
import { useRouter } from "next/router";

// External libraries
import axios from "axios";
import clsx from "clsx";

// Internal modules
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/Button";
import { formatDate } from "@/utils/date";

// Local imports
import { UserAvatar } from "./UserAvatar";
import { validateEmail } from "../utils/validation";

// Types
import type { IUser } from "@/types/user";

// Styles
import styles from "./UserCard.module.scss";
```

---

## 6. React Patterns

### Component Declaration

**Prefer named function exports:**

```typescript
export function UserCard({ userId }: UserCardProps) {
    // ...
}
```

**Not:**

```typescript
export const UserCard: React.FC<UserCardProps> = ({ userId }) => {
    // ...
};
```

### State Management

**Use descriptive state names:**

```typescript
const [isLoading, setIsLoading] = useState(false);
const [userData, setUserData] = useState<IUser | null>(null);
```

**Not generic names:**

```typescript
const [loading, setLoading] = useState(false);
const [data, setData] = useState(null);
```

### Event Handlers

**Use `handle` prefix:**

```typescript
const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // ...
};

const handleUserClick = (userId: number) => {
    // ...
};
```

---

## 7. Formatting Rules

### Line Length

- Maximum **100 characters** per line
- Break long chains into multiple lines

### Destructuring

**Prefer destructuring:**

```typescript
const { email, role } = user;
const { data, error } = await fetchUser(id);
```

### Optional Chaining

Use `?.` for potentially undefined values:

```typescript
const email = user?.contact?.email;
```

But avoid excessive chaining—consider restructuring if you need more than 2 levels.

---

## 8. TypeScript-Specific

### Avoid `any`

Use proper types or `unknown` for truly unknown data:

```typescript
// ❌ Bad
function processData(data: any) { ... }

// ✅ Good
function processData<T>(data: T) { ... }
function processData(data: unknown) { ... }
```

### Use Type Guards

```typescript
function isUser(value: unknown): value is IUser {
    return typeof value === "object" && value !== null && "email" in value;
}
```

### Explicit Return Types for Public APIs

```typescript
export function calculateTotal(items: IItem[]): number {
    // ...
}
```

---

## 9. React Hooks Rules

### Custom Hooks Naming

All hooks **must** start with `use`:

```typescript
function useWindowSize() { ... }
function useDebouncedValue() { ... }
```

### Hook Dependency Arrays

Always include all dependencies:

```typescript
useEffect(() => {
    fetchData(userId);
}, [userId]); // ✅ userId included
```

---

## 10. Examples

### Complete Component Example

```typescript
import React, { useState } from 'react';
import type { IUser } from '@/types/user';
import styles from './UserProfile.module.scss';

interface UserProfileProps {
  user: IUser;
  onUpdate: (user: IUser) => void;
}

export function UserProfile({ user, onUpdate }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = (updatedUser: IUser) => {
    onUpdate(updatedUser);
    setIsEditing(false);
  };

  return (
    <div className={styles.container}>
      <h2>{user.email}</h2>
      <button onClick={handleEditToggle}>
        {isEditing ? 'Cancel' : 'Edit'}
      </button>
    </div>
  );
}
```

### Complete Service Example

```typescript
import axios from "axios";

interface ILoginCredentials {
    email: string;
    password: string;
}

interface IAuthResponse {
    token: string;
    expiresAt: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function login(credentials: ILoginCredentials): Promise<IAuthResponse> {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    return response.data;
}
```
