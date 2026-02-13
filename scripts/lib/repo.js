"use strict";

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const CACHE_DIR_NAME = path.join(".heymark", "cache");

/**
 * 저장소 URL에서 캐시 폴더명으로 쓸 수 있는 문자열 추출
 * https://github.com/org/repo -> org-repo
 * git@github.com:org/repo.git -> org-repo
 */
function sanitizeRepoName(url) {
    let s = url.trim();
    if (s.endsWith(".git")) s = s.slice(0, -4);
    const match = s.match(/github\.com[:/]([^/]+\/[^/]+?)(?:\/|$)/) || s.match(/([^/]+\/[^/]+?)(?:\/|$)/);
    if (match) {
        return match[1].replace(/\//g, "-");
    }
    return s.replace(/[^a-zA-Z0-9._-]/g, "-") || "repo";
}

/**
 * 원격 저장소를 clone 또는 pull하여, 규칙 .md가 있는 로컬 디렉터리 절대 경로를 반환합니다.
 * Private repo는 사용자의 git 인증(SSH 키, credential)으로 접근해야 합니다.
 * @param {string} projectRoot - 현재 프로젝트 루트
 * @param {{ rulesSource: string, branch?: string, rulesSourceDir?: string }} config
 * @returns {string} - .md 파일이 있는 디렉터리의 절대 경로
 */
function getRulesDirFromRepo(projectRoot, config) {
    const url = config.rulesSource;
    const branch = config.branch || "main";
    const subDir = config.rulesSourceDir || "";

    const cacheBase = path.join(projectRoot, CACHE_DIR_NAME);
    const repoName = sanitizeRepoName(url);
    const clonePath = path.join(cacheBase, repoName);

    if (!fs.existsSync(clonePath)) {
        fs.mkdirSync(cacheBase, { recursive: true });
        try {
            execSync(`git clone --depth 1 --branch "${branch}" "${url}" "${clonePath}"`, {
                stdio: "inherit",
                cwd: projectRoot,
            });
        } catch (err) {
            console.error("[Error] Failed to clone rules repository.");
            console.error("  For private repos, ensure you have access (SSH key or HTTPS token).");
            console.error("  Example: heymark init https://github.com/org/repo.git");
            process.exit(1);
        }
    } else {
        try {
            execSync("git fetch origin && git checkout --quiet . && git pull --quiet origin " + branch, {
                stdio: "pipe",
                cwd: clonePath,
            });
        } catch (err) {
            // pull 실패 시(네트워크 등) 기존 클론 내용으로 진행
        }
    }

    const rulesDir = subDir ? path.join(clonePath, subDir) : clonePath;
    if (!fs.existsSync(rulesDir) || !fs.statSync(rulesDir).isDirectory()) {
        console.error(`[Error] Rules directory not found in repo: ${subDir || "(root)"}`);
        process.exit(1);
    }
    return rulesDir;
}

module.exports = {
    CACHE_DIR_NAME,
    getRulesDirFromRepo,
    sanitizeRepoName,
};
