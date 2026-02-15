"use strict";

const fs = require("fs");
const path = require("path");

const CONFIG_DIR = ".heymark";
const CONFIG_FILENAME = "config.json";
/** 프로젝트 루트 기준 설정 파일 경로 (표시용) */
const CONFIG_RELATIVE = path.join(CONFIG_DIR, CONFIG_FILENAME);

/**
 * rulesSource: GitHub 저장소 URL (https://github.com/org/repo 또는 git@github.com:org/repo.git)
 * branch: 브랜치 (기본 main)
 * rulesSourceDir: 저장소 내부에서 .md가 있는 하위 디렉터리 (기본 "" = 루트)
 * @typedef {{ rulesSource: string, branch?: string, rulesSourceDir?: string }} RuleBookConfig
 */

/**
 * 프로젝트 루트에서 .heymark/config.json을 읽습니다.
 * @param {string} projectRoot - 프로젝트 루트 (보통 process.cwd())
 * @returns {RuleBookConfig | null}
 */
function loadConfig(projectRoot) {
    const configPath = path.join(projectRoot, CONFIG_DIR, CONFIG_FILENAME);
    if (!fs.existsSync(configPath)) return null;

    try {
        const raw = fs.readFileSync(configPath, "utf8");
        const data = JSON.parse(raw);
        if (!data || typeof data.rulesSource !== "string" || !data.rulesSource.trim()) {
            return null;
        }
        return {
            rulesSource: data.rulesSource.trim(),
            branch:
                typeof data.branch === "string" && data.branch.trim() ? data.branch.trim() : "main",
            rulesSourceDir:
                typeof data.rulesSourceDir === "string" ? data.rulesSourceDir.trim() : "",
        };
    } catch {
        return null;
    }
}

/**
 * 초기 설정 파일을 생성합니다. (원격 GitHub 저장소 URL 사용) .heymark/config.json에 저장합니다.
 * @param {string} projectRoot
 * @param {RuleBookConfig} config - { rulesSource: repoUrl, branch?, rulesSourceDir? }
 */
function writeConfig(projectRoot, config) {
    const configDir = path.join(projectRoot, CONFIG_DIR);
    if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
    }
    const configPath = path.join(configDir, CONFIG_FILENAME);
    const toWrite = {
        rulesSource: config.rulesSource,
        branch: config.branch || "main",
    };
    if (config.rulesSourceDir) {
        toWrite.rulesSourceDir = config.rulesSourceDir;
    }
    fs.writeFileSync(configPath, JSON.stringify(toWrite, null, 2), "utf8");
    return configPath;
}

module.exports = {
    CONFIG_DIR,
    CONFIG_FILENAME,
    CONFIG_RELATIVE,
    loadConfig,
    writeConfig,
};
