const fs = require("fs");
const path = require("path");
const { SKILL_FILE_EXTENSION } = require("@/skill-repo/constants");

const FRONTMATTER_REGEX = /^---\r?\n([\s\S]+?)\r?\n---\r?\n?([\s\S]*)$/;

function parseFrontmatter(content) {
    const match = content.match(FRONTMATTER_REGEX);
    if (!match) {
        return { metadata: {}, body: content.trim() };
    }

    const [, metadataBlock, body] = match;

    const metadata = {};
    metadataBlock.split(/\r?\n/).forEach((line) => {
        const separatorIndex = line.indexOf(":");
        if (separatorIndex === -1) return;

        const key = line.slice(0, separatorIndex).trim();
        let value = line.slice(separatorIndex + 1).trim();

        if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
        ) {
            value = value.slice(1, -1);
        }

        if (value === "true") metadata[key] = true;
        else if (value === "false") metadata[key] = false;
        else metadata[key] = value;
    });

    return { metadata, body: body.trim() };
}

function readSkillFile(skillsDir, fileName) {
    const filePath = path.join(skillsDir, fileName);
    const raw = fs.readFileSync(filePath, "utf8");
    const { metadata, body } = parseFrontmatter(raw);
    const baseName = path.basename(fileName, SKILL_FILE_EXTENSION);

    return {
        fileName,
        name: typeof metadata.name === "string" && metadata.name ? metadata.name : baseName,
        description:
            typeof metadata.description === "string" && metadata.description
                ? metadata.description
                : baseName,
        globs: typeof metadata.globs === "string" ? metadata.globs : "",
        alwaysApply: metadata.alwaysApply === true,
        metadata,
        body,
    };
}

function readSkillFiles(skillsDir) {
    if (!fs.existsSync(skillsDir)) {
        console.error(`[Error] Skills folder not found: ${skillsDir}`);
        process.exit(1);
    }

    const files = fs
        .readdirSync(skillsDir)
        .filter((fileName) => fileName.endsWith(SKILL_FILE_EXTENSION))
        .sort();

    if (files.length === 0) {
        console.error(`[Error] No .md files in: ${skillsDir}`);
        process.exit(1);
    }

    return files.map((fileName) => readSkillFile(skillsDir, fileName));
}

module.exports = {
    readSkillFiles,
};
