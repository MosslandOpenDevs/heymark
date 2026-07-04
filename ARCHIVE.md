# Heymark — Archive & Wind-down Notes

**Status:** Archived / reference implementation
**Date:** 2026-07-04
**Last released version:** 2.1.1 (final correctness pass; 2.1.0 was the last feature release, 2026-03-03)

This document records why Heymark is being archived, a snapshot of the mid-2026
AI-coding-tool landscape it operated in, what was fixed in the final pass, and the
limitations that remain. It is intended as a reference for anyone who later revisits
this repository or the problem space.

---

## 1. What Heymark is

A ~1,000-LOC, zero-dependency Node.js CLI that treats one Markdown "Skill" repository
as a single source of truth and fans it out into the on-disk formats of six AI coding
tools. Three commands:

- `link <repo-url> [--branch|-b] [--folder|-f]` — record the source repo in `.heymark/config`.
- `sync [. | <tool>...]` — shallow-clone/pull the repo, parse each skill's frontmatter, emit per-tool files.
- `clean [. | <tool>...]` — remove generated output.

Targets: Cursor (`.cursor/rules/*.mdc`), Claude Code (`.claude/skills/*/SKILL.md`),
Copilot (`.github/instructions/*.instructions.md`), Codex (`.agents/skills/*/SKILL.md`),
Antigravity (`.agents/skills/*/SKILL.md`), OpenClaw (`~/.openclaw/skills/*/SKILL.md`).

---

## 2. Why it is being archived

A mid-2026 review concluded Heymark is a small, late entrant to a saturated and
consolidating niche, and that its core premise is eroding. Key points (figures as of
2026-07-04, from npm/GitHub APIs and vendor docs):

- **The niche is crowded and consolidating.** The identical "single source → fan out to
  all AI tools" pitch is owned by mature incumbents:
  - **rulesync** — ~1.2k stars, ~762k npm downloads/month, 40+ tools, emits rules +
    skills + commands + subagents + MCP config.
  - **Ruler** (`@intellectronica/ruler`) — ~2.8k stars, ~149k npm downloads/month, ~31
    tools, rules + skills + MCP.
  - Plus a long tail of 10+ near-identical tools (ai-rulez, block/ai-rules, ai-rules-sync, …).
  - Heymark covers **6 tools, skills only** — a strict subset on both axes.

- **The problem is being standardized away.**
  - **Agent Skills / `SKILL.md`** became an open standard (agentskills.io, Dec 2025)
    adopted by Claude Code, Codex, and Gemini CLI. A single `SKILL.md` is already
    portable across most skill tools, so Heymark's per-tool `SKILL.md` outputs are
    near-identical (they differ mainly by output directory, not content).
  - **`AGENTS.md`** became a cross-tool standard (28+ native readers, ~60k repos) placed
    under the Linux Foundation's Agentic AI Foundation (Dec 2025) alongside MCP. It is a
    complementary flat-instructions layer, not a skills substitute — but Heymark ships no
    `AGENTS.md` support, so it neither adopts nor benefits from the converging baseline.
  - Net: the genuinely distinct formats worth translating in 2026 reduce to two outliers
    — Cursor `.mdc` and Copilot `.instructions.md` — plus path re-rooting.

- **Adoption never materialized.** 1 GitHub star, 0 forks, 0 npm dependents; ~1,389
  lifetime npm downloads concentrated at launch (~82/month, ~20/week now); publishing
  stalled after v2.1.0 on 2026-03-03; ~2 internal (Mossland-affiliated) committers, no
  external contributors. This is an internal/early tool that was open-sourced, not a
  broadly adopted community project.

**Conclusion:** rather than compete head-on as a generic converter, Heymark is archived
as a reference. A future revival would need a different wedge (adopt `AGENTS.md` +
portable `SKILL.md` and translate only the true outliers; or lean into the `link <repo>`
remote-distribution / team-governance angle), not more format coverage.

---

## 3. Final correctness pass (v2.1.1)

Two of the six advertised mappings were broken, plus three output/robustness defects.
All were fixed in the final pass before archiving:

**Broken formats (fixed)**

- **Copilot output was invalid.** `src/tools/copilot/index.js` emitted frontmatter with
  no opening `---` and wrote `applyTo` as a YAML block list. VS Code/Copilot then parsed
  the whole block as body text and silently dropped glob scoping. Now emits a proper
  `---`-delimited block with `applyTo` as the documented single comma-separated string.
- **Antigravity path was wrong.** `src/tools/constants.js` used `.agent/skills`
  (singular); Antigravity discovers project skills under `.agents/skills` (plural). Fixed
  in `constants.js` and both READMEs. (The `.gitignore` already listed `.agents`.)

**Output/robustness (fixed)**

- **YAML injection in generated frontmatter.** `description`/`globs`/`name` were
  interpolated as raw `"${value}"`; a value containing `"`, `\`, or a newline produced
  invalid frontmatter. Now routed through `src/tools/yaml.js` `yamlQuote()`
  (JSON-string escaping, a valid YAML double-quoted subset).
- **Command injection.** `src/skill-repo/cache-folder.js` interpolated `repoUrl`/`branch`
  into a shell string via `execSync`. Switched to `execFileSync("git", [...args])` so
  values are never shell-parsed.
- **Path traversal.** Skill `name` (from frontmatter) flowed unescaped into `path.join`
  for output/clean; `--folder` was joined into the clone path unchecked. Added a
  skill-name guard (`skill-file-parser.js`, rejects separators / `..`) and a folder
  containment check (`cache-folder.js`).

**Docs**

- Corrected the "YAML frontmatter parsing" claim to describe the actual hand-rolled
  `key: value` parser.

---

## 4. Known limitations (not addressed)

- **No `AGENTS.md` target.** The now-standard baseline file is not emitted (see §2).
- **Skill parser is not real YAML.** `src/skill-repo/skill-file-parser.js` handles only
  single-line `key: value` scalars; block lists (`globs:\n  - a`), nested maps, multiline
  scalars, and flow lists are not supported. Skills encode multiple globs as one
  comma-separated string by convention.
- **OpenClaw is inconsistent with the other targets.** It writes to the machine-global
  `~/.openclaw/skills` rather than the project `cwd`, cleans per-skill-name instead of
  removing the whole output dir, and throws on error (aborting a multi-tool sync)
  where other tools do not.
- **Dropped features.** `status`, `validate`, and `--json`/dry-run existed in earlier
  history (`scripts/`) but were removed in the domain refactor and are not in `src/`.
  The open PRs #8/#9/#10 that added them predate that refactor and no longer apply.
- **No tests / no CI.** `CONTRIBUTING.md` mandates tests and passing checks, but there is
  no test harness or workflow. The bugs above are all deterministic and would have been
  caught by a minimal unit suite.

---

## 5. Reviving the project

If work resumes: un-archive on GitHub, restore a `scripts.test` + CI, add an `AGENTS.md`
target, and narrow the value proposition per §2. The tool-plugin contract
(`src/tools/<name>/index.js` exporting `{key, name, output, generate, clean}`, auto-loaded
by `src/tools/loader.js`) makes adding or changing a target low-friction.
