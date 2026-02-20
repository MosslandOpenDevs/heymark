# Contributing to heymark

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a feature branch from `main`

## Branch Strategy

| Branch      | Purpose                   |
| ----------- | ------------------------- |
| `main`      | Stable release branch     |
| `dev`       | Active development branch |
| `feature/*` | New features              |
| `fix/*`     | Bug fixes                 |
| `docs/*`    | Documentation updates     |

## Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```text
<type>(<scope>): <description>

[optional body]
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:

```text
feat(core): implement seed prompt parser
fix(sync): resolve duplicate output generation
docs(readme): update roadmap section
```

## Pull Request Process

1. Ensure your branch is up to date with `main`
2. Write a clear PR title and description
3. Link related issues
4. Request review from at least one maintainer
5. Ensure required checks pass before merge

## Code Standards

- Follow the style guide used by each language in the project
- Use static typing features where applicable (for example, type hints or TypeScript types)
- Add docstrings/JSDoc for public functions when needed
- Add or update tests for new features and bug fixes

## Documentation

- Keep documentation clear and up to date
- If translated versions are maintained (for example, `.ko.md`), update them together
- Keep terminology consistent across related docs

## Questions?

Open an issue with the `question` label.
