const { CODEX } = require("@/tools/constants");
const { generate, clean } = require("@/tools/skill-per-folder");
const { yamlQuote } = require("@/tools/yaml");

function createContent(skill) {
    const frontmatterLines = [
        "---",
        `name: ${yamlQuote(skill.name)}`,
        `description: ${yamlQuote(skill.description)}`,
        "---",
    ];

    return `${frontmatterLines.join("\n")}\n\n${skill.body}\n`;
}

module.exports = {
    key: CODEX.KEY,
    name: CODEX.NAME,
    output: CODEX.OUTPUT_PATTERN,

    generate(skills, cwd) {
        return generate({
            cwd,
            dir: CODEX.SKILLS_DIR,
            fileName: CODEX.SKILL_FILE_NAME,
            skills,
            createContent,
        });
    },

    clean(skillNames, cwd) {
        return clean(cwd, CODEX.SKILLS_DIR);
    },
};
