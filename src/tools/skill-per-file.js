const fs = require("fs");
const path = require("path");

function isDryRun() {
    return process.env.HEYMARK_DRY_RUN === "1";
}

function generate({ cwd, dir, skills, getFileName, createContent }) {
    const destDir = path.join(cwd, dir);

    if (!isDryRun()) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    for (const skill of skills) {
        const filePath = path.join(destDir, getFileName(skill));
        if (!isDryRun()) {
            fs.writeFileSync(filePath, createContent(skill), "utf8");
        }
    }

    return skills.length;
}

function clean(cwd, dir) {
    const targetPath = path.join(cwd, dir);
    if (!fs.existsSync(targetPath)) {
        return [];
    }

    if (!isDryRun()) {
        fs.rmSync(targetPath, { recursive: true, force: true });
    }
    return [dir];
}

module.exports = {
    generate,
    clean,
};
