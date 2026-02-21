"use strict";

const fs = require("fs");
const path = require("path");

const SKILLS_DIR = path.join(".agents", "skills");
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
    name: "OpenAI Codex",
    output: ".agents/skills/*/SKILL.md",

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
        const skillsDirPath = path.join(projectRoot, SKILLS_DIR);
        if (!fs.existsSync(skillsDirPath)) {
            return [];
        }

        fs.rmSync(skillsDirPath, { recursive: true, force: true });
        return [SKILLS_DIR];
    },
};
