"use strict";

const fs = require("fs");
const path = require("path");

const CONFIG_DIR = ".heymark";
const CONFIG_FILENAME = "config.json";
const DEFAULT_BRANCH = "main";
const CONFIG_RELATIVE = path.join(CONFIG_DIR, CONFIG_FILENAME);

/**
 * @typedef {{ repoUrl: string, branch?: string, folder?: string }} THeymarkConfig
 */

/**
 * Resolve config file path from project root.
 * @param {string} projectRoot
 * @returns {string}
 */
function getConfigPath(projectRoot) {
    return path.join(projectRoot, CONFIG_DIR, CONFIG_FILENAME);
}

/**
 * Normalize and validate config payload.
 * @param {unknown} value
 * @returns {THeymarkConfig | null}
 */
function normalizeConfig(value) {
    if (!value || typeof value !== "object") {
        return null;
    }

    const raw = /** @type {{
     *   repoUrl?: unknown,
     *   branch?: unknown,
     *   folder?: unknown,
     *   rulesSource?: unknown,
     *   rulesSourceDir?: unknown
     * }} */ (value);

    const repoUrl =
        typeof raw.repoUrl === "string" && raw.repoUrl.trim()
            ? raw.repoUrl.trim()
            : typeof raw.rulesSource === "string" && raw.rulesSource.trim()
              ? raw.rulesSource.trim()
              : "";

    if (!repoUrl) {
        return null;
    }

    return {
        repoUrl,
        branch:
            typeof raw.branch === "string" && raw.branch.trim()
                ? raw.branch.trim()
                : DEFAULT_BRANCH,
        folder:
            typeof raw.folder === "string"
                ? raw.folder.trim()
                : typeof raw.rulesSourceDir === "string"
                  ? raw.rulesSourceDir.trim()
                  : "",
    };
}

/**
 * Read config from project root.
 * @param {string} projectRoot
 * @returns {THeymarkConfig | null}
 */
function loadConfig(projectRoot) {
    const configPath = getConfigPath(projectRoot);
    if (!fs.existsSync(configPath)) {
        return null;
    }

    try {
        const raw = fs.readFileSync(configPath, "utf8");
        return normalizeConfig(JSON.parse(raw));
    } catch {
        return null;
    }
}

/**
 * Create initial config file in .heymark/config.json.
 * @param {string} projectRoot
 * @param {THeymarkConfig} config
 * @returns {string}
 */
function writeConfig(projectRoot, config) {
    const configDir = path.join(projectRoot, CONFIG_DIR);
    if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
    }

    const normalized = normalizeConfig(config);
    if (!normalized) {
        throw new Error("Invalid config payload");
    }

    const configPath = path.join(configDir, CONFIG_FILENAME);
    const toWrite = {
        repoUrl: normalized.repoUrl,
        branch: normalized.branch || DEFAULT_BRANCH,
    };
    if (normalized.folder) {
        toWrite.folder = normalized.folder;
    }

    fs.writeFileSync(configPath, JSON.stringify(toWrite, null, 2), "utf8");
    return configPath;
}

module.exports = {
    CONFIG_DIR,
    CONFIG_FILENAME,
    CONFIG_RELATIVE,
    DEFAULT_BRANCH,
    getConfigPath,
    loadConfig,
    normalizeConfig,
    writeConfig,
};
