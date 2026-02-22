const fs = require("fs");
const path = require("path");
const { HEYMARK, SKILL_REPO_DEFAULT_BRANCH } = require("@/skill-repo/constants");

function getConfigFilePath(cwd) {
    return path.join(cwd, HEYMARK.DIR, HEYMARK.CONFIG_FILE);
}

function parseRawConfig(rawConfig) {
    if (!rawConfig || typeof rawConfig !== "object") {
        return null;
    }

    const raw = rawConfig;

    const repoUrl =
        typeof raw.repoUrl === "string" && raw.repoUrl.trim()
            ? raw.repoUrl.trim()
            : typeof raw.skillSource === "string" && raw.skillSource.trim()
              ? raw.skillSource.trim()
              : typeof raw.rulesSource === "string" && raw.rulesSource.trim()
                ? raw.rulesSource.trim()
                : "";

    if (!repoUrl) {
        return null;
    }

    const branch =
        typeof raw.branch === "string" && raw.branch.trim()
            ? raw.branch.trim()
            : SKILL_REPO_DEFAULT_BRANCH;

    const folder =
        typeof raw.folder === "string"
            ? raw.folder.trim()
            : typeof raw.skillSourceDir === "string"
              ? raw.skillSourceDir.trim()
              : typeof raw.rulesSourceDir === "string"
                ? raw.rulesSourceDir.trim()
                : "";

    return { repoUrl, branch, folder };
}

function writeConfig(cwd, config) {
    const dir = path.join(cwd, HEYMARK.DIR);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const data = parseRawConfig(config);
    if (!data) {
        throw new Error("Invalid config");
    }

    const filePath = getConfigFilePath(cwd);
    const payload = {
        repoUrl: data.repoUrl,
        branch: data.branch || SKILL_REPO_DEFAULT_BRANCH,
    };
    if (data.folder) {
        payload.folder = data.folder;
    }

    fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), "utf8");
    return filePath;
}

function readConfig(cwd) {
    const filePath = getConfigFilePath(cwd);
    if (!fs.existsSync(filePath)) {
        return null;
    }

    try {
        const raw = fs.readFileSync(filePath, "utf8");
        return parseRawConfig(JSON.parse(raw));
    } catch {
        return null;
    }
}

module.exports = {
    writeConfig,
    readConfig,
};
