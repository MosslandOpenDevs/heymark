const fs = require("fs");
const path = require("path");
const os = require("os");
const { OPENCLAW } = require("@/tools/constants");

function createContent(skill) {
    const frontmatterLines = [
        "---",
        `name: ${skill.name}`,
        `description: "${skill.description}"`,
        "---",
    ];

    return `${frontmatterLines.join("\n")}\n\n${skill.body}\n`;
}

function getSkillsDir() {
    return path.join(os.homedir(), OPENCLAW.SKILLS_DIR);
}

function generate(skills) {
    const skillsDir = getSkillsDir();

    for (const skill of skills) {
        try {
            const skillDir = path.join(skillsDir, skill.name);
            fs.mkdirSync(skillDir, { recursive: true });
            fs.writeFileSync(path.join(skillDir, OPENCLAW.SKILL_FILE_NAME), createContent(skill), "utf8");
        } catch (err) {
            const skillDir = path.join(skillsDir, skill.name);
            throw new Error(`OpenClaw: failed to generate skill "${skill.name}" at ${skillDir}: ${err.message}`);
        }
    }

    return skills.length;
}

function clean(skillNames) {
    const skillsDir = getSkillsDir();
    if (!fs.existsSync(skillsDir)) {
        return [];
    }

    const cleanedPaths = [];
    for (const skillName of skillNames) {
        const skillDir = path.join(skillsDir, skillName);
        if (!fs.existsSync(skillDir)) continue;

        try {
            fs.rmSync(skillDir, { recursive: true, force: true });
            cleanedPaths.push(path.join(skillsDir, skillName));
        } catch (err) {
            throw new Error(`OpenClaw: failed to clean skill "${skillName}" at ${skillDir}: ${err.message}`);
        }
    }

    return cleanedPaths;
}

module.exports = {
    key: OPENCLAW.KEY,
    name: OPENCLAW.NAME,
    output: OPENCLAW.OUTPUT_PATTERN,

    generate(skills) {
        return generate(skills);
    },

    clean(skillNames) {
        return clean(skillNames);
    },
};
