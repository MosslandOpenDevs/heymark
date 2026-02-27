const fs = require("fs");
const path = require("path");

function generate({ cwd, dir, skills, getFileName, createContent }) {
    const destDir = path.join(cwd, dir);
    fs.mkdirSync(destDir, { recursive: true });

    for (const skill of skills) {
        const filePath = path.join(destDir, getFileName(skill));
        fs.writeFileSync(filePath, createContent(skill), "utf8");
    }

    return skills.length;
}

function preview({ cwd, dir, skills, getFileName, createContent, fileSuffix }) {
    const destDir = path.join(cwd, dir);
    const expected = new Map();
    const created = [];
    const updated = [];
    const deleted = [];

    for (const skill of skills) {
        const relativePath = path.join(dir, getFileName(skill));
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

    if (fs.existsSync(destDir)) {
        const existing = fs
            .readdirSync(destDir)
            .filter((fileName) => (fileSuffix ? fileName.endsWith(fileSuffix) : true))
            .map((fileName) => path.join(dir, fileName));

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

function clean(cwd, dir) {
    const targetPath = path.join(cwd, dir);
    if (!fs.existsSync(targetPath)) {
        return [];
    }

    fs.rmSync(targetPath, { recursive: true, force: true });
    return [dir];
}

module.exports = {
    generate,
    preview,
    clean,
};
