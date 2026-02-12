"use strict";

const fs = require("fs");
const path = require("path");

module.exports = {
  name: "Claude Code",
  output: ".claude/skills/*/SKILL.md",

  generate(rules, projectRoot) {
    for (const rule of rules) {
      const skillDir = path.join(projectRoot, ".claude", "skills", rule.name);
      fs.mkdirSync(skillDir, { recursive: true });

      const lines = [
        "---",
        `name: ${rule.name}`,
        `description: "${rule.description}"`,
        "---",
      ];

      const content = lines.join("\n") + "\n\n" + rule.body + "\n";
      fs.writeFileSync(path.join(skillDir, "SKILL.md"), content);
    }

    return rules.length;
  },

  clean(ruleNames, projectRoot) {
    const cleaned = [];

    for (const name of ruleNames) {
      const skillDir = path.join(projectRoot, ".claude", "skills", name);
      if (fs.existsSync(skillDir)) {
        fs.rmSync(skillDir, { recursive: true });
        cleaned.push(path.join(".claude", "skills", name));
      }
    }

    return cleaned;
  },
};
