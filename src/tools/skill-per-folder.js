const fs = require("fs");
const path = require("path");
const { clean } = require("@/tools/skill-per-file");

function generate({ cwd, dir, fileName, skills, createContent }) {
    for (const skill of skills) {
        const skillDir = path.join(cwd, dir, skill.name);
        fs.mkdirSync(skillDir, { recursive: true });
        fs.writeFileSync(path.join(skillDir, fileName), createContent(skill), "utf8");
    }

    return skills.length;
}

function preview({ cwd, dir, fileName, skills, createContent }) {
    const baseDir = path.join(cwd, dir);
    const expected = new Map();
    const created = [];
    const updated = [];
    const deleted = [];

    for (const skill of skills) {
        const relativePath = path.join(dir, skill.name, fileName);
        expected.set(relativePath, createContent(skill));
    }

    for (const [relativePath, content] of expected.entries()) {
        const absolutePath = path.join(cwd, relativePath);
        if (!fs.existsSync(absolutePath)) {
            created.push(relativePath);
            continue;
        }

        const current = fs.readFileSync(absolutePath, "utf8");
        if (current !== content) {
            updated.push(relativePath);
        }
    }

    if (fs.existsSync(baseDir)) {
        const existing = fs
            .readdirSync(baseDir)
            .filter((name) => fs.statSync(path.join(baseDir, name)).isDirectory())
            .map((name) => path.join(dir, name, fileName));

        for (const relativePath of existing) {
            if (!expected.has(relativePath)) {
                deleted.push(relativePath);
            }
        }
    }

    return {
        created: created.sort(),
        updated: updated.sort(),
        deleted: deleted.sort(),
    };
}

module.exports = {
    generate,
    preview,
    clean,
};
