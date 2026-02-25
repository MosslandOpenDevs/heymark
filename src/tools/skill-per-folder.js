const fs = require("fs");
const path = require("path");
const { clean } = require("@/tools/skill-per-file");

function isDryRun() {
    return process.env.HEYMARK_DRY_RUN === "1";
}

function generate({ cwd, dir, fileName, skills, createContent }) {
    for (const skill of skills) {
        const skillDir = path.join(cwd, dir, skill.name);
        if (!isDryRun()) {
            fs.mkdirSync(skillDir, { recursive: true });
            fs.writeFileSync(path.join(skillDir, fileName), createContent(skill), "utf8");
        }
    }

    return skills.length;
}

module.exports = {
    generate,
    clean,
};
