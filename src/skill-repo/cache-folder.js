const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { HEYMARK, SKILL_REPO_DEFAULT_BRANCH } = require("@/skill-repo/constants");
const { readConfig } = require("@/skill-repo/config-file");
const { readSkillFiles } = require("@/skill-repo/skill-file-parser");

function getCloneFolderPath(cwd, repoUrl) {
    const name = repoUrl.trim().split("/").pop() || "repo";
    const dirName = name.endsWith(".git") ? name.slice(0, -4) : name;
    return path.join(cwd, HEYMARK.DIR, HEYMARK.CACHE_DIR, dirName);
}

function gitClone(cwd, dir, branch, repoUrl) {
    execSync(`git clone --depth 1 --branch "${branch}" "${repoUrl}" "${dir}"`, {
        stdio: "inherit",
        cwd,
    });
}

function gitPull(dir, branch) {
    execSync(`git fetch origin && git checkout --quiet . && git pull --quiet origin "${branch}"`, {
        stdio: "pipe",
        cwd: dir,
    });
}

function writeCache(cwd) {
    const config = readConfig(cwd);
    if (!config) {
        console.error(
            `[Error] Not linked. Run: heymark link <repo-url> (config: ${HEYMARK.DIR}/${HEYMARK.CONFIG_FILE})`
        );
        process.exit(1);
    }

    const branch = config.branch || SKILL_REPO_DEFAULT_BRANCH;
    const cacheBase = path.join(cwd, HEYMARK.DIR, HEYMARK.CACHE_DIR);
    const cloneFolderPath = getCloneFolderPath(cwd, config.repoUrl);

    if (!fs.existsSync(cloneFolderPath)) {
        fs.mkdirSync(cacheBase, { recursive: true });
        try {
            gitClone(cwd, cloneFolderPath, branch, config.repoUrl);
        } catch {
            console.error("[Error] Clone failed. Check repo access (SSH or token).");
            process.exit(1);
        }
    } else {
        try {
            gitPull(cloneFolderPath, branch);
        } catch {
            // Continue with cached clone when fetch/pull fails.
        }
    }

    return { config, cloneFolderPath };
}

function readCache(cwd) {
    const { config, cloneFolderPath } = writeCache(cwd);

    const folder = config.folder || "";
    const skillsFolderPath = folder ? path.join(cloneFolderPath, folder) : cloneFolderPath;
    if (!fs.existsSync(skillsFolderPath) || !fs.statSync(skillsFolderPath).isDirectory()) {
        console.error(`[Error] Folder not found in repo: ${folder || "(root)"}`);
        process.exit(1);
    }

    const skills = readSkillFiles(skillsFolderPath);

    return { config, skillsFolderPath, skills };
}

module.exports = {
    readCache,
};
