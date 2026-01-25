# Frontend Guide

## Tech Stack

Next.js (App Router), React, TypeScript, SCSS Modules, Zustand, Yarn

## Project Structure

```
heymark/
├── app/                    # Next.js App Router
│   ├── layout.tsx
│   └── (pages)/            # Route Group
│       ├── page.tsx        # /
│       └── [slug]/
│           └── page.tsx    # /:slug
├── src/
│   ├── app/                # FSD app layer
│   │   ├── styles/
│   │   ├── providers/
│   │   └── types/
│   ├── features/
│   │   └── [feature]/
│   │       ├── ui/
│   │       ├── lib/
│   │       └── styles/
│   └── shared/
│       ├── ui/
│       ├── lib/
│       ├── config/
│       └── styles/
```

## Design Pattern

Simplified Feature-Sliced Design (FSD)

### Layers

```
app → features → shared
```

- Upper layers can only import from lower layers
- Same-level layers cannot import from each other
- `shared` is accessible from all layers

### Segments

Each slice can have:

- `ui/` — UI components
- `lib/` — Business logic, API, stores
- `styles/` — Component-specific styles

### Public API

Each slice must export through `index.ts`:

```typescript
// Correct
import { Container } from "@/features/post-list";
import { useAuthStore } from "@/features/auth";
import { fetchPosts } from "@/shared/lib/api";

// Incorrect
import { Container } from "@/features/post-list/ui/Container";
import { useAuthStore } from "@/features/auth/lib/store";
```

## Architecture

### app/ (FSD layer)

App initialization and global settings

```
app/
├── styles/      # Global reset and base styles
├── providers/   # App providers (e.g. Toaster)
└── types/       # Global type declarations
```

### features/

User scenario features with business logic and UI

Segments: `ui/`, `lib/`, `styles/`

```
features/
└── [feature]/
    ├── ui/
    ├── lib/
    ├── styles/
    └── index.ts
```

### shared/

Common resources accessible from all layers

Segments: `ui/`, `lib/`, `config/`, `styles/`

```
shared/
├── ui/
├── lib/
├── config/
└── styles/
```

## Built-in Setup

### Path Alias

Use `@/` for `src/`:

```typescript
import { Container } from "@/features/post-list";
import { ROUTES } from "@/shared/config";
```
