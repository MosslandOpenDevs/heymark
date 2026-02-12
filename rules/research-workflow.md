---
description: "Technical research workflow for generating in-depth reports with web search and analysis"
globs: ""
alwaysApply: false
---

# Research Workflow: Deep Technical Investigation

This rule defines the workflow for conducting thorough technical research and producing professional-grade technical reports. **Use this workflow when explicitly requested by the user** (e.g., "research X", "investigate Y", "compare Z").

---

## 1. Core Principles

### Factual Accuracy

- Base conclusions on official documentation, technical blogs, academic papers, and whitepapers
- **Never speculate** or present assumptions as facts
- Cite all sources with direct URLs

### Professional Tone

- Use clear, technical language
- **No emojis** in research documents
- Avoid marketing language and hyperbole
- Focus on technical feasibility and trade-offs

### Deep Analysis

- Go beyond feature lists—explain **how** things work
- Identify limitations, constraints, and edge cases
- Provide architectural insights and implementation considerations

### Scannable Structure

- Use logical headings for easy navigation
- Include a concise executive summary
- Highlight key findings and actionable insights

---

## 2. Research Process

### Phase 1: Multi-Angle Search (5+ queries minimum)

Use web search to gather information from multiple perspectives:

1. **Official documentation** (e.g., "TypeScript 5.0 official release notes")
2. **Technical comparisons** (e.g., "React vs Vue performance benchmarks 2026")
3. **Implementation guides** (e.g., "implementing Redis caching in Node.js")
4. **Known issues** (e.g., "Next.js 14 common problems GitHub")
5. **Alternative solutions** (e.g., "alternatives to PostgreSQL for time-series data")

**Search strategy:**

- Start broad, then narrow based on findings
- Include version numbers and years for currency
- Search for both official and community resources

### Phase 2: Deep Data Extraction

From search results, identify 3-5 critical URLs and fetch full content:

- API specifications and technical references
- Architecture diagrams and system design docs
- Benchmark data and performance analyses
- Security advisories and best practice guides

### Phase 3: Synthesis & Analysis

Combine findings into a coherent narrative:

- Identify patterns and contradictions across sources
- Evaluate trade-offs between approaches
- Assess technical feasibility for the specific use case
- Provide architectural recommendations

---

## 3. Report Structure

### Title & Metadata

```markdown
# [Research Topic]

**Date:** YYYY-MM-DD
**Scope:** [Brief description of what was investigated]
**Key Finding:** [One-sentence summary]
```

### Executive Summary (3-5 sentences)

Provide the **bottom line** upfront:

- What was researched and why
- Key findings or recommendations
- Critical constraints or considerations

### Main Body Sections

Organize by logical themes, not by source. Examples:

- **Technical Feasibility**
- **Architecture Considerations**
- **Performance Characteristics**
- **Security & Compliance**
- **Alternative Approaches**
- **Implementation Roadmap**

### Conclusion & Action Plan

- Synthesize findings into clear recommendations
- Provide specific next steps or decisions to be made
- Highlight any risks or unknowns

### Sources

List all referenced URLs at the end:

```markdown
## Sources

1. [Title](URL) - Brief description
2. [Title](URL) - Brief description
   ...
```

---

## 4. Output Specifications

### File Naming

Use descriptive English keywords separated by hyphens:

- ✅ `redis-vs-memcached-comparison.md`
- ✅ `nextjs-14-migration-guide.md`
- ✅ `postgresql-scaling-strategies.md`
- ❌ `research.md`
- ❌ `tech_report.md`

### File Location

Save research documents to:

- `/research/` (if dedicated folder exists)
- `/docs/research/` (for documentation-focused projects)
- Project root (if no convention exists)

### Format

- **Markdown** (`.md`)
- Use code blocks for examples with appropriate language tags
- Include diagrams using mermaid when helpful
- Use tables for comparisons

---

## 5. Writing Guidelines

### Technical Depth

**Do:**

- Explain implementation details and architectural patterns
- Discuss performance characteristics with numbers/benchmarks
- Identify edge cases and failure modes
- Compare alternatives with objective criteria

**Don't:**

- List features without context
- Use marketing language ("blazingly fast", "revolutionary")
- Make unsupported claims
- Ignore limitations or drawbacks

### Language & Style

- Write in **English**
- Use present tense for current state, past tense for historical context
- Prefer active voice
- Define acronyms on first use

### Code Examples

Include minimal, runnable examples when relevant:

```typescript
// Good: Shows key concept clearly
const cache = new Redis({ host: "localhost", port: 6379 });
await cache.set("user:123", JSON.stringify(userData), "EX", 3600);
```

Avoid:

- Incomplete snippets that can't run
- Overly complex examples mixing multiple concepts
- Placeholder code with comments like `// do something here`

---

## 6. Example Research Report

```markdown
# GraphQL vs REST API: Performance & Developer Experience Comparison

**Date:** 2026-02-12
**Scope:** Backend API design for real-time dashboard application
**Key Finding:** GraphQL reduces over-fetching by 60% but adds 15-20ms latency vs REST

## Executive Summary

This research compares GraphQL and REST for a real-time dashboard requiring
frequent updates and complex data relationships. GraphQL significantly reduces
payload sizes (60% smaller on average) but introduces query parsing overhead
(15-20ms). For this use case, GraphQL is recommended due to client-side
complexity reduction and improved cache efficiency.

## Technical Feasibility

### REST API Characteristics

- Multiple endpoints for related data (e.g., `/users`, `/users/123/posts`)
- Client-side data stitching required
- Standard HTTP caching (ETag, Cache-Control)
- Average payload: 24KB per dashboard load

### GraphQL Characteristics

- Single endpoint with flexible queries
- Server-side data resolution
- Response-specific caching strategies required
- Average payload: 9.6KB per dashboard load (60% reduction)

### Performance Benchmarks

| Metric            | REST  | GraphQL | Difference |
| :---------------- | :---- | :------ | :--------- |
| Cold start        | 120ms | 135ms   | +12.5%     |
| Cached response   | 15ms  | 30ms    | +100%      |
| Payload size      | 24KB  | 9.6KB   | -60%       |
| Client processing | 45ms  | 18ms    | -60%       |

## Architecture Considerations

### REST Benefits

- Simpler infrastructure (standard CDN caching)
- Better tooling for monitoring/debugging
- Lower server-side complexity

### GraphQL Benefits

- Reduced client complexity (no data stitching)
- Better mobile performance (smaller payloads)
- Type safety with code generation

## Recommendation

Use **GraphQL** for this project because:

1. Dashboard complexity favors simplified client code
2. Mobile users benefit significantly from reduced payload sizes
3. 15ms added latency is acceptable for this use case
4. Type generation improves developer experience

## Implementation Notes

- Use DataLoader for batching to prevent N+1 queries
- Implement query complexity limits to prevent abuse
- Consider persisted queries for production deployment
- Plan for 2-3 week learning curve for team

## Sources

1. [GraphQL Best Practices](https://graphql.org/learn/best-practices/)
2. [REST vs GraphQL Performance Study](https://example.com/study)
3. [Apollo Server Documentation](https://www.apollographql.com/docs/)
```

---

## 7. When to Use This Workflow

**Appropriate scenarios:**

- User explicitly requests research ("research X", "investigate Y")
- Evaluating technology choices for architectural decisions
- Comparing tools, frameworks, or libraries
- Investigating unfamiliar domains or technologies
- Creating knowledge base documentation

**Inappropriate scenarios:**

- Simple coding questions with known answers
- Quick fact-checking (use direct search instead)
- Debugging specific code issues
- Routine feature implementation

---

## 8. Quality Checklist

Before delivering a research report:

- [ ] Searched from at least 5 different angles
- [ ] Fetched and analyzed 3-5 key documents in full
- [ ] Cited all sources with direct URLs
- [ ] Provided specific numbers/benchmarks where available
- [ ] Identified trade-offs and limitations
- [ ] Included actionable recommendations
- [ ] Used professional, emoji-free language
- [ ] Followed file naming conventions
- [ ] Structured content for scannability
