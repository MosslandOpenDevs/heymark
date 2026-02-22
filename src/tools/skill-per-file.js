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
    clean,
};
