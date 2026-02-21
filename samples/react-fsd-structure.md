---
description: Apply Simplified Feature-Sliced Design (FSD) to React projects by defining layer boundaries, slice structure, and public API import rules. Use when asked to design, review, or refactor React architecture with simplified FSD.
globs: "**/src/**/*"
alwaysApply: false
---

# React Simplified FSD Standards

## Layer Model

- Use `app`, `pages`, `features`, and `shared` as the only top-level layers
- Keep dependency direction as `app -> pages -> features -> shared`
- Import only from lower layers when crossing layer boundaries
- Treat `shared` as reusable foundation code for all higher layers

## Slice Layout

- Create one slice per route under `pages/`
- Create one slice per user capability under `features/`
- Keep each `pages/*` and `features/*` slice structured with `ui/`, `lib/`, and `styles/`
- Add segment folders only when the segment has real code
- Keep app bootstrap, router, providers, and global setup under `app/`

## Segment Ownership

- Place React components and composition logic in `ui/`
- Place business logic, hooks, API clients, and mappers in `lib/`
- Place slice-scoped style files in `styles/`
- Place global constants and localization settings in `shared/config/`
- Place cross-feature utilities and shared types in `shared/lib/`

## Public API Contract

- Create `index.ts` in every `pages/*` and `features/*` slice
- Export stable entry points only from each `index.ts`
- Import slices through `@/pages/<slice>` or `@/features/<slice>` only
- Avoid deep imports such as `@/features/<slice>/ui/<Component>`
- Allow deep imports only for internal files in the same slice

## Shared Layer Rules

- Keep `shared` free of business-specific behavior
- Split shared code into `shared/ui`, `shared/lib`, `shared/config`, and `shared/styles`
- Move duplicated UI and utilities from multiple slices into `shared`
- Prevent `shared` from importing `features`, `pages`, or `app`

## Path and Validation

- Configure `@` alias to the source root before enforcing import rules
- Run checks that detect upward imports and same-layer cross-imports
- Verify each route-facing page is exported through `pages/<slice>/index.ts`
- Verify each feature consumed by pages is exported through `features/<slice>/index.ts`
- Review changed files for layer and segment boundary violations before merging

## Example Structure

- Use the tree below as the baseline for new React projects
- Mirror route names in `pages` slice names
- Mirror user capability names in `features` slice names

```text
src/
├── app/
│   ├── App.tsx
│   ├── styles/
│   └── types/
├── pages/
│   └── dashboard/
│       ├── ui/
│       ├── lib/
│       ├── styles/
│       └── index.ts
├── features/
│   └── auth/
│       ├── ui/
│       ├── lib/
│       ├── styles/
│       └── index.ts
└── shared/
    ├── ui/
    ├── lib/
    ├── config/
    └── styles/
```
