"use strict";

const fs = require("fs");
const path = require("path");
const { writeMergedFile } = require("../lib/parser");

module.exports = {
    name: "OpenAI Codex",
    output: "AGENTS.md",

    generate(rules, projectRoot) {
        writeMergedFile(path.join(projectRoot, "AGENTS.md"), rules);
        return rules.length;
    },

    clean(_ruleNames, projectRoot) {
        const filePath = path.join(projectRoot, "AGENTS.md");
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return ["AGENTS.md"];
        }
        return [];
    },
};
