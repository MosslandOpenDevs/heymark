const { CURSOR } = require("@/tools/constants");
const { generate, clean } = require("@/tools/skill-per-file");

function getFileName(skill) {
    return `${skill.name}${CURSOR.FILE_SUFFIX}`;
}

function createContent(skill) {
    const frontmatterLines = ["---", `description: "${skill.description}"`];

    if (skill.globs) {
        frontmatterLines.push(`globs: "${skill.globs}"`);
    }

    frontmatterLines.push(`alwaysApply: ${skill.alwaysApply}`);
    frontmatterLines.push("---");

    return `${frontmatterLines.join("\n")}\n\n${skill.body}\n`;
}

module.exports = {
    key: CURSOR.KEY,
    name: CURSOR.NAME,
    output: CURSOR.OUTPUT_PATTERN,

    generate(skills, cwd) {
        return generate({
            cwd,
            dir: CURSOR.SKILLS_DIR,
            skills,
            getFileName,
            createContent,
        });
    },

    clean(skillNames, cwd) {
        return clean(cwd, CURSOR.SKILLS_DIR);
    },
};
