"use strict";

const fs = require("fs");
const path = require("path");

const INSTRUCTIONS_DIR = path.join(".github", "instructions");
const FILE_SUFFIX = ".instructions.md";
const DEFAULT_GLOB = "**";

function getInstructionPath(projectRoot, ruleName) {
    return path.join(projectRoot, INSTRUCTIONS_DIR, `${ruleName}${FILE_SUFFIX}`);
}

function normalizeGlobs(globsValue) {
    if (!globsValue) {
        return [DEFAULT_GLOB];
    }

    const globs = globsValue
        .split(",")
        .map((glob) => glob.trim())
        .filter(Boolean);

    return globs.length > 0 ? globs : [DEFAULT_GLOB];
}

function createInstructionContent(rule) {
    const applyToLines = normalizeGlobs(rule.globs)
        .map((glob) => `  - "${glob}"`)
        .join("\n");
    const header = `applyTo:\n${applyToLines}\n---`;
    return `${header}\n\n${rule.body}\n`;
}

module.exports = {
    name: "GitHub Copilot",
    output: ".github/instructions/*.instructions.md",

    generate(rules, projectRoot) {
        const destDir = path.join(projectRoot, INSTRUCTIONS_DIR);
        fs.mkdirSync(destDir, { recursive: true });

        for (const rule of rules) {
            const filePath = getInstructionPath(projectRoot, rule.name);
            const content = createInstructionContent(rule);
            fs.writeFileSync(filePath, content, "utf8");
        }

        return rules.length;
    },

    clean(ruleNames, projectRoot) {
        const cleaned = [];

        for (const ruleName of ruleNames) {
            const filePath = getInstructionPath(projectRoot, ruleName);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                cleaned.push(path.join(INSTRUCTIONS_DIR, `${ruleName}${FILE_SUFFIX}`));
            }
        }

        return cleaned;
    },
};
