"use strict";

const fs = require("fs");
const path = require("path");

const SKILLS_DIR = path.join(".claude", "skills");
const SKILL_FILE_NAME = "SKILL.md";

function getSkillDir(projectRoot, ruleName) {
    return path.join(projectRoot, SKILLS_DIR, ruleName);
}

function createSkillContent(rule) {
    const frontmatterLines = [
        "---",
        `name: ${rule.name}`,
        `description: "${rule.description}"`,
        "---",
    ];

    return `${frontmatterLines.join("\n")}\n\n${rule.body}\n`;
}

module.exports = {
    name: "Claude Code",
    output: ".claude/skills/*/SKILL.md",

    generate(rules, projectRoot) {
        for (const rule of rules) {
            const skillDir = getSkillDir(projectRoot, rule.name);
            fs.mkdirSync(skillDir, { recursive: true });
            const filePath = path.join(skillDir, SKILL_FILE_NAME);
            const content = createSkillContent(rule);
            fs.writeFileSync(filePath, content, "utf8");
        }

        return rules.length;
    },

    clean(ruleNames, projectRoot) {
        const cleaned = [];

        for (const ruleName of ruleNames) {
            const skillDir = getSkillDir(projectRoot, ruleName);
            if (fs.existsSync(skillDir)) {
                fs.rmSync(skillDir, { recursive: true });
                cleaned.push(path.join(SKILLS_DIR, ruleName));
            }
        }

        return cleaned;
    },
};
