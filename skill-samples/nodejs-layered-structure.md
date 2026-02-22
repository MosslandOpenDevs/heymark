---
description: Apply layered Node.js backend architecture using routes, controllers, models, config, and utils. Use when designing, reviewing, or refactoring backend API server structure and request flow.
globs: "**/src/**/*"
alwaysApply: false
---

# Node.js Layered Backend Standards

## Layer Model

- Use `routes`, `controllers`, `models`, `utils`, and `config` as the baseline backend layers
- Keep request flow direction as `routes -> controllers -> models`
- Keep `utils` and `config` as support layers reused by all other layers
- Keep each file responsible for one layer concern only

## Dependency Rules

- Import route handlers from `controllers` only in `routes`
- Import data-access modules from `models` only in `controllers`
- Avoid importing `controllers` or `routes` from `models`
- Import environment values and constants only through `config`
- Import cross-cutting helpers only through `utils`

## Folder Structure

- Place endpoint registration and route prefix logic in `routes/`
- Place HTTP input parsing and response shaping in `controllers/`
- Place schema definitions and persistence adapters in `models/`
- Place reusable pure helpers and middleware helpers in `utils/`
- Place runtime configuration and global type declarations in `config/`

## Controller Rules

- Extract request data at the start of each controller function
- Call model functions for persistence and query operations
- Return a normalized response body shape for successful requests
- Throw errors with explicit HTTP status metadata for handled failures
- Split controller-local types into `<name>.types.ts` files

## Model Rules

- Define schema fields with explicit types and required constraints
- Keep model modules free of HTTP framework objects and response logic
- Export model APIs through stable named exports
- Isolate query helpers to keep controllers thin

## Error and Response Contract

- Throw errors in controllers and let error middleware map final HTTP responses
- Attach `status` to domain errors that need non-500 status codes
- Keep default unhandled errors mapped to HTTP 500 responses
- Return consistent success envelopes such as `{ success: true, data: ... }`
- Log error context in middleware without leaking sensitive data

## Configuration and Runtime

- Read environment variables in `config` and re-export typed constants
- Validate required environment variables during app bootstrap
- Keep application entrypoint setup in `src/index.ts`
- Register global middleware before route registration

## Example Structure

- Use the tree below as the reference for initial project scaffolding
- Keep folder names stable to simplify onboarding and lint configuration
- Keep route, controller, and model naming aligned by domain term

```text
src/
├── routes/
├── controllers/
├── models/
├── utils/
├── config/
└── index.ts
```
