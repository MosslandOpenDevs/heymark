const { ANTIGRAVITY } = require("@/tools/constants");
const { generate, clean } = require("@/tools/skill-per-folder");

function createContent(skill) {
    const frontmatterLines = [
        "---",
        `name: ${skill.name}`,
        `description: "${skill.description}"`,
        "---",
    ];

    return `${frontmatterLines.join("\n")}\n\n${skill.body}\n`;
}

module.exports = {
    key: ANTIGRAVITY.KEY,
    name: ANTIGRAVITY.NAME,
    output: ANTIGRAVITY.OUTPUT_PATTERN,

    generate(skills, cwd) {
        return generate({
            cwd,
            dir: ANTIGRAVITY.SKILLS_DIR,
            fileName: ANTIGRAVITY.SKILL_FILE_NAME,
            skills,
            createContent,
        });
    },

    clean(skillNames, cwd) {
        return clean(cwd, ANTIGRAVITY.SKILLS_DIR);
    },
};
