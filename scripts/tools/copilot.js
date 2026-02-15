"use strict";

const fs = require("fs");
const path = require("path");

module.exports = {
    name: "GitHub Copilot",
    output: ".github/instructions/*.instructions.md",

    generate(rules, projectRoot) {
        const destDir = path.join(projectRoot, ".github", "instructions");
        fs.mkdirSync(destDir, { recursive: true });

        for (const rule of rules) {
            const globs = rule.globs ? rule.globs.split(",").map((g) => g.trim()) : ["**"];

            const applyToLines = globs.map((g) => `  - "${g}"`).join("\n");
            const header = `applyTo:\n${applyToLines}\n---`;

            const content = header + "\n\n" + rule.body + "\n";
            fs.writeFileSync(path.join(destDir, `${rule.name}.instructions.md`), content);
        }

        return rules.length;
    },

    clean(ruleNames, projectRoot) {
        const cleaned = [];
        const destDir = path.join(projectRoot, ".github", "instructions");

        for (const name of ruleNames) {
            const filePath = path.join(destDir, `${name}.instructions.md`);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                cleaned.push(path.join(".github", "instructions", `${name}.instructions.md`));
            }
        }

        return cleaned;
    },
};
