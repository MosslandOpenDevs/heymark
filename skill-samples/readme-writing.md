---
description: README writing standards for structure, language, and maintenance-safe content
globs: "**/README.md"
alwaysApply: false
---

# README Writing Standards

## Required Structure

- Follow this order: Title -> Intro -> Table of Contents -> Overview -> Features -> Tech Stack -> Getting Started
- Keep Intro to 1-2 concise lines
- Keep Overview to 3-5 sentences focused on scope and value
- Include only sections that provide operational value to readers
- Keep section names stable to reduce maintenance churn

## Language Rules

- Write headings in English
- Write body text in Korean
- Write code blocks and shell commands in English
- Keep terminology consistent across all sections
- Avoid mixed-language sentences in a single bullet

## Style Rules

- Use concise, formal, and factual tone
- Avoid emojis, badges, and decorative formatting
- Prefer Markdown syntax over HTML tags
- Keep one bullet to one clear message
- Remove marketing language and vague adjectives

## Content Rules

- List only concrete, user-visible features
- Explain each feature in one short line
- Include only core technologies in Tech Stack
- Exclude volatile implementation details such as internal variable names
- Keep Getting Started minimal and directly runnable

## Getting Started Contract

- Add prerequisites only when strictly required
- Provide install commands in one code block
- Provide run commands in one code block
- Add environment setup steps only when mandatory
- Verify command order matches actual execution flow

## Prohibited Patterns

- Long README with low-information sections
- Abstract claims without technical evidence
- References to unstable internal file paths
- Optional sections with no project-specific value
- Duplicated explanations across multiple sections

## Final Validation

- Structure follows the required section order
- Language policy is consistent across headings, body, and code
- Setup commands are runnable in listed order
- Feature and stack sections are concrete and non-promotional
- No duplicated or low-value content remains
