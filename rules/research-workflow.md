---
description: "Technical research workflow for generating in-depth reports with web search and analysis"
globs: ""
alwaysApply: false
---

# Research Workflow

Activate when user explicitly requests research ("research X", "investigate Y", "compare Z"). Not for simple coding questions, quick fact-checks, debugging, or routine implementation.

## Principles

- Base conclusions on **official docs, technical blogs, papers, whitepapers**
- **Never** speculate or present assumptions as facts
- Cite all sources with direct URLs
- No emojis in research documents
- Explain **how** things work, not just features; identify limitations and edge cases
- Use clear technical language; avoid marketing language ("blazingly fast", "revolutionary")

## Process

### Phase 1: Multi-Angle Search (5+ queries)

1. Official documentation (include version numbers and year)
2. Technical comparisons and benchmarks
3. Implementation guides and best practices
4. Known issues and limitations
5. Alternative solutions

Start broad, narrow based on findings.

### Phase 2: Deep Extraction

Fetch full content of 3-5 critical URLs:
- API specs, technical references
- Architecture and system design docs
- Benchmark data, performance analyses
- Security advisories

### Phase 3: Synthesis

- Identify patterns and contradictions across sources
- Evaluate trade-offs between approaches
- Assess feasibility for the specific use case
- Form architectural recommendations

## Report Format

```
# [Topic]

**Date:** YYYY-MM-DD
**Scope:** [Brief description]
**Key Finding:** [One sentence]

## Executive Summary
3-5 sentences: what, why, key findings, constraints.

## [Thematic Sections]
Organize by theme, not by source:
- Technical Feasibility
- Architecture Considerations
- Performance Characteristics
- Alternative Approaches

## Conclusion
Recommendations, next steps, risks/unknowns.

## Sources
1. [Title](URL) - Description
```

## Output

- **Filename:** descriptive English, kebab-case (`redis-vs-memcached-comparison.md`)
- **Location:** `/research/`, `/docs/research/`, or project root
- **Format:** Markdown with code blocks, mermaid diagrams, comparison tables
- **Language:** English, present tense, active voice, define acronyms on first use
- Include minimal runnable code examples where relevant
