const { COPILOT } = require("@/tools/constants");
const { generate, clean } = require("@/tools/skill-per-file");

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
    const applyToLines = (globs.length > 0 ? globs : [COPILOT.DEFAULT_GLOB])
        .map((glob) => `  - "${glob}"`)
        .join("\n");
    const header = `applyTo:\n${applyToLines}\n---`;
    return `${header}\n\n${skill.body}\n`;
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
