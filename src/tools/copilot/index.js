const { COPILOT } = require("@/tools/constants");
const { generate, clean } = require("@/tools/skill-per-file");
const { yamlQuote } = require("@/tools/yaml");

function getFileName(skill) {
    return `${skill.name}${COPILOT.FILE_SUFFIX}`;
}

function createContent(skill) {
    const globs = skill.globs
        ? skill.globs
              .split(",")
              .map((g) => g.trim())
              .filter(Boolean)
        : [];
    const applyTo = globs.length > 0 ? globs.join(",") : COPILOT.DEFAULT_GLOB;
    const frontmatter = ["---", `applyTo: ${yamlQuote(applyTo)}`, "---"].join("\n");
    return `${frontmatter}\n\n${skill.body}\n`;
}

module.exports = {
    key: COPILOT.KEY,
    name: COPILOT.NAME,
    output: COPILOT.OUTPUT_PATTERN,

    generate(skills, cwd) {
        return generate({
            cwd,
            dir: COPILOT.INSTRUCTIONS_DIR,
            skills,
            getFileName,
            createContent,
        });
    },

    clean(skillNames, cwd) {
        return clean(cwd, COPILOT.INSTRUCTIONS_DIR);
    },
};
