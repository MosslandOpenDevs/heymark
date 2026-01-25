# Contributing Guidelines

## Documentation

- [Frontend Guide](README.frontend.md)
- [Backend Guide](README.backend.md)

## Table of Contents

- [Naming Conventions](#naming-conventions)
- [Types and Scope](#types-and-scope)
- [Commit Message](#commit-message)
- [Issue](#issue)
- [Pull Request](#pull-request)

## Naming Conventions

### Files

- Common files - kebab-case.ts (user-service.ts)
- Components - PascalCase.tsx (DashboardPage.tsx)
- SCSS Modules - PascalCase.module.scss (Card.module.scss)

### Code

- Functions/Variables - camelCase (getUserData)
- Constants - UPPER_SNAKE_CASE (API_BASE_URL)
- Components - PascalCase (UserCard)
- Private members - prefix with `_` (\_privateMethod)

### Types

- Interface - I + PascalCase (IUser) or descriptive name (UserInfo)
- Type alias - T + PascalCase (TConfig)
- Enum - E + PascalCase (EUserRole)
- Props - `<ComponentName>Props` (ButtonProps)
- Generic - T, K, V or meaningful names (TResponse)

### Comments

- Use JSDoc or concise `//` comments
- No separator comments like `// ============`

### Comment Tags

Use tags for team-shared comments:

**`@note`** Important context, warnings, or intent

```typescript
// @note Caching required due to API rate limit
```

**`@todo(<owner>): <action>`** Follow-up work (owner required)

```typescript
// @todo(john): add validation logic
```

**`@wip`** Work in progress or temporary code (remove before merge)

```typescript
// @wip Temporary mock data, remove after API integration
```

**`@deprecated`** Deprecated code (specify alternative)

```typescript
// @deprecated - use fetchUserV2() instead
```

Tag placement:

- Single line: `// @tag ...`
- Multiple lines: `/** @tag ... */`
- Tag must be the first token

## Types and Scope

### Type

Use in issue labels, PR labels, and commit messages:

- `feat` - New feature
- `fix` - Bug fix
- `refactor` - Code refactoring (no behavior change)
- `perf` - Performance improvement
- `docs` - Documentation changes
- `test` - Test additions or changes
- `ci` - CI configuration or scripts
- `build` - Build tools or dependencies
- `style` - Code style changes (no logic change)
- `chore` - Maintenance tasks

### Scope

- Format: single lowercase word (`[a-z0-9]+`)
- Purpose: main area affected by the change
- Examples: `auth`, `api`, `ui`, `admin`, `cli`
- Optional if unclear

## Commit Message

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Rules

- **Header (required)**
    - `<type>`: Choose from Type list above
    - `(<scope>)`: Optional single word
    - `<subject>`: English, imperative verb, lowercase, no period
- **Body (optional)**: Detailed change description

- **Footer (recommended)**: `Refs #issue-number` (use Closes in PRs only)

### Examples

```
fix(api): handle timeout error

Add retry logic with exponential backoff

Refs #456
```

## Testing

### OAuth Flow

When testing OAuth login:

1. Ensure `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set
2. Configure OAuth redirect URI in Google Console
3. Test with both public and private posts

### CLI Commands

When testing CLI:

1. Test `heymark call` command
2. Test `heymark add` with various markdown files
3. Test `heymark add -d` (delete original file)
4. Test `heymark open` command

### GitHub API

When testing with GitHub API:

- Test with mock data during development
- Test with real GitHub API in staging
- Ensure `POSTS_GITHUB_TOKEN` has correct permissions

## Issue

### Purpose

Define what needs to be done (work plan)

### Title

- Brief summary (any format)
- Example: "Add user profile edit feature"

### Body

- **Goal**: Purpose and background
- **Tasks**: Checklist of work items
- **References**: Related docs, API specs, design links

### Workflow

- One issue per PR

## Pull Request

### Purpose

Share how it was implemented (work result)

### Title

```
<type>(<scope>): <subject> (#issue)
```

- Same rules as commit messages
- Example: `feat(user): add profile edit feature (#123)`

### Body

- **Changes**: Summary of key changes
- **Implementation**: Core logic and technical decisions
- **Notes**: Important information for reviewers
- **Closes #123**: Resolved issue number (use Refs in commits only)

### Workflow

- One PR per issue
