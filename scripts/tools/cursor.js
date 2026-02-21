"use strict";

const fs = require("fs");
const path = require("path");

const RULES_DIR = path.join(".cursor", "rules");
const FILE_SUFFIX = ".mdc";

function getRulePath(projectRoot, ruleName) {
    return path.join(projectRoot, RULES_DIR, `${ruleName}${FILE_SUFFIX}`);
}

function createRuleContent(rule) {
    const frontmatterLines = ["---", `description: "${rule.description}"`];
    if (rule.globs) {
        frontmatterLines.push(`globs: "${rule.globs}"`);
    }
    frontmatterLines.push(`alwaysApply: ${rule.alwaysApply}`);
    frontmatterLines.push("---");

    return `${frontmatterLines.join("\n")}\n\n${rule.body}\n`;
}

module.exports = {
    name: "Cursor",
    output: ".cursor/rules/*.mdc",

    generate(rules, projectRoot) {
        const destDir = path.join(projectRoot, RULES_DIR);
        fs.mkdirSync(destDir, { recursive: true });

        for (const rule of rules) {
            fs.writeFileSync(getRulePath(projectRoot, rule.name), createRuleContent(rule), "utf8");
        }

        return rules.length;
    },

    clean(ruleNames, projectRoot) {
        const cleaned = [];

        for (const ruleName of ruleNames) {
            const filePath = getRulePath(projectRoot, ruleName);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                cleaned.push(path.join(RULES_DIR, `${ruleName}${FILE_SUFFIX}`));
            }
        }

        return cleaned;
    },
};
