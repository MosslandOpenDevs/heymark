"use strict";

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const CACHE_DIR_NAME = path.join(".heymark", "cache");
const DEFAULT_BRANCH = "main";
const GITHUB_REPO_PATTERN = /github\.com[:/]([^/]+\/[^/]+?)(?:\/|$)/;
const GENERIC_REPO_PATTERN = /([^/]+\/[^/]+?)(?:\/|$)/;

/**
 * Convert repository URL to a stable cache directory name.
 * https://github.com/org/repo -> org-repo
 * git@github.com:org/repo.git -> org-repo
 * @param {string} repoUrl
 * @returns {string}
 */
function sanitizeRepoName(repoUrl) {
    let normalized = repoUrl.trim();
    if (normalized.endsWith(".git")) {
        normalized = normalized.slice(0, -4);
    }

    const match = normalized.match(GITHUB_REPO_PATTERN) || normalized.match(GENERIC_REPO_PATTERN);
    if (match) {
        return match[1].replace(/\//g, "-");
    }

    return normalized.replace(/[^a-zA-Z0-9._-]/g, "-") || "repo";
}

function cloneRulesRepo(projectRoot, clonePath, branch, repoUrl) {
    execSync(`git clone --depth 1 --branch "${branch}" "${repoUrl}" "${clonePath}"`, {
        stdio: "inherit",
        cwd: projectRoot,
    });
}

function updateRulesRepo(clonePath, branch) {
    execSync(`git fetch origin && git checkout --quiet . && git pull --quiet origin "${branch}"`, {
        stdio: "pipe",
        cwd: clonePath,
    });
}

function resolveRulesDirectory(clonePath, rulesSourceDir) {
    const rulesDir = rulesSourceDir ? path.join(clonePath, rulesSourceDir) : clonePath;
    if (!fs.existsSync(rulesDir) || !fs.statSync(rulesDir).isDirectory()) {
        console.error(`[Error] Rules directory not found in repo: ${rulesSourceDir || "(root)"}`);
        process.exit(1);
    }
    return rulesDir;
}

/**
 * Clone or update remote repository and return local rules directory.
 * Private repositories require user git credentials (SSH key or token).
 * @param {string} projectRoot
 * @param {{ rulesSource: string, branch?: string, rulesSourceDir?: string }} config
 * @returns {string}
 */
function getRulesDirFromRepo(projectRoot, config) {
    const repoUrl = config.rulesSource;
    const branch = config.branch || DEFAULT_BRANCH;
    const rulesSourceDir = config.rulesSourceDir || "";

    const cacheBase = path.join(projectRoot, CACHE_DIR_NAME);
    const repoName = sanitizeRepoName(repoUrl);
    const clonePath = path.join(cacheBase, repoName);

    if (!fs.existsSync(clonePath)) {
        fs.mkdirSync(cacheBase, { recursive: true });
        try {
            cloneRulesRepo(projectRoot, clonePath, branch, repoUrl);
        } catch {
            console.error("[Error] Failed to clone rules repository.");
            console.error("  For private repos, ensure you have access (SSH key or HTTPS token).");
            console.error("  Example: heymark init https://github.com/org/repo.git");
            process.exit(1);
        }
    } else {
        try {
            updateRulesRepo(clonePath, branch);
        } catch {
            // Continue with cached clone when fetch or pull fails.
        }
    }

    return resolveRulesDirectory(clonePath, rulesSourceDir);
}

module.exports = {
    CACHE_DIR_NAME,
    getRulesDirFromRepo,
    sanitizeRepoName,
};
