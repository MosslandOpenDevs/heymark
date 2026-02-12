"use strict";

const fs = require("fs");
const path = require("path");

module.exports = {
  name: "Cursor",
  output: ".cursor/rules/*.mdc",

  generate(rules, projectRoot) {
    const destDir = path.join(projectRoot, ".cursor", "rules");
    fs.mkdirSync(destDir, { recursive: true });

    for (const rule of rules) {
      const lines = ["---", `description: "${rule.description}"`];
      if (rule.globs) lines.push(`globs: "${rule.globs}"`);
      lines.push(`alwaysApply: ${rule.alwaysApply}`);
      lines.push("---");

      const content = lines.join("\n") + "\n\n" + rule.body + "\n";
      fs.writeFileSync(path.join(destDir, `${rule.name}.mdc`), content);
    }

    return rules.length;
  },

  clean(ruleNames, projectRoot) {
    const cleaned = [];
    const destDir = path.join(projectRoot, ".cursor", "rules");

    for (const name of ruleNames) {
      const filePath = path.join(destDir, `${name}.mdc`);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        cleaned.push(path.join(".cursor", "rules", `${name}.mdc`));
      }
    }

    return cleaned;
  },
};
