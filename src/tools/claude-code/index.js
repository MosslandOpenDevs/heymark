const { CLAUDE_CODE } = require("@/tools/constants");
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
    key: CLAUDE_CODE.KEY,
    name: CLAUDE_CODE.NAME,
    output: CLAUDE_CODE.OUTPUT_PATTERN,

    generate(skills, cwd) {
        return generate({
            cwd,
            dir: CLAUDE_CODE.SKILLS_DIR,
            fileName: CLAUDE_CODE.SKILL_FILE_NAME,
            skills,
            createContent,
        });
    },

    clean(skillNames, cwd) {
        return clean(cwd, CLAUDE_CODE.SKILLS_DIR);
    },
};
