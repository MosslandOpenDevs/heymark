# Backend Guide

## Tech Stack

Next.js API Routes, Node.js, TypeScript, Yarn

## Project Structure

```
heymark/
├── app/
│   └── api/               # Route Handlers → /api/...
│       └── [endpoint]/
│           └── route.ts   # GET, POST, etc.
├── server/                # Server utilities
│   └── [domain]/          # auth, config, github, markdown, ...
```

## Design Pattern

API Routes handle HTTP; server holds reusable logic.

### Layers

```
app/api/  →  server/
```

- **app/api/** — HTTP boundary. `route.ts` per path; export GET, POST, etc.
- **server/** — Per-domain logic (auth, config, integrations). `app/api/` imports; `src/` does not.

### Import Rules

- `app/api/` may import from `server/`
- `src/` must not import from `server/`
- `app/api/` must not import from `src/`

## Architecture

### app/api/[endpoint]/

One `route.ts` per path. Export method handlers; dynamic `[param]` in the second argument. Use `NextResponse.json` and status for errors.

### server/[domain]/

One folder per domain (auth, config, github, markdown). Structure varies; `app/api/` calls into these.

## Built-in Setup

### Path Alias

Use `@server/` for server imports:

```typescript
import { fetchGitHubFile } from "@server/github/client";
import { parseFrontmatter } from "@server/markdown/parse";
```

## Google OAuth Setup

Create an OAuth client in [Google Cloud Console](https://console.cloud.google.com/):

1. **APIs & Services → Credentials → Create Credentials → OAuth client ID**
2. **Application type**: Web application
3. **Authorized JavaScript origins**:
    - `http://localhost:3000` (local)
    - `https://your-heymark-url.com` (production)
4. **Authorized redirect URIs**:
    - `http://localhost:3000/api/auth/google` (local)
    - `https://your-heymark-url.com/api/auth/google` (production)

Set `NEXT_PUBLIC_GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env.local`.
