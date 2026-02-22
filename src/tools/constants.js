const path = require("path");

const ANTIGRAVITY = {
    KEY: "antigravity",
    NAME: "Antigravity",
    SKILLS_DIR: path.join(".agent", "skills"),
    SKILL_FILE_NAME: "SKILL.md",
    OUTPUT_PATTERN: ".agent/skills/*/SKILL.md",
};

const CLAUDE_CODE = {
    KEY: "claude-code",
    NAME: "Claude Code",
    SKILLS_DIR: path.join(".claude", "skills"),
    SKILL_FILE_NAME: "SKILL.md",
    OUTPUT_PATTERN: ".claude/skills/*/SKILL.md",
};

const CODEX = {
    KEY: "codex",
    NAME: "Codex",
    SKILLS_DIR: path.join(".agents", "skills"),
    SKILL_FILE_NAME: "SKILL.md",
    OUTPUT_PATTERN: ".agents/skills/*/SKILL.md",
};

const COPILOT = {
    KEY: "copilot",
    NAME: "Copilot",
    INSTRUCTIONS_DIR: path.join(".github", "instructions"),
    FILE_SUFFIX: ".instructions.md",
    DEFAULT_GLOB: "**",
    OUTPUT_PATTERN: ".github/instructions/*.instructions.md",
};

const CURSOR = {
    KEY: "cursor",
    NAME: "Cursor",
    SKILLS_DIR: path.join(".cursor", "rules"),
    FILE_SUFFIX: ".mdc",
    OUTPUT_PATTERN: ".cursor/rules/*.mdc",
};

module.exports = { ANTIGRAVITY, CLAUDE_CODE, CODEX, COPILOT, CURSOR };
