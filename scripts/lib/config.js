"use strict";

const fs = require("fs");
const path = require("path");

const CONFIG_DIR = ".heymark";
const CONFIG_FILENAME = "config.json";
const DEFAULT_BRANCH = "main";
const CONFIG_RELATIVE = path.join(CONFIG_DIR, CONFIG_FILENAME);

/**
 * @typedef {{ rulesSource: string, branch?: string, rulesSourceDir?: string }} RuleBookConfig
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
 * @returns {RuleBookConfig | null}
 */
function normalizeConfig(value) {
    if (!value || typeof value !== "object") {
        return null;
    }

    const raw =
        /** @type {{ rulesSource?: unknown, branch?: unknown, rulesSourceDir?: unknown }} */ (
            value
        );
    if (typeof raw.rulesSource !== "string" || !raw.rulesSource.trim()) {
        return null;
    }

    return {
        rulesSource: raw.rulesSource.trim(),
        branch:
            typeof raw.branch === "string" && raw.branch.trim()
                ? raw.branch.trim()
                : DEFAULT_BRANCH,
        rulesSourceDir: typeof raw.rulesSourceDir === "string" ? raw.rulesSourceDir.trim() : "",
    };
}

/**
 * Read config from project root.
 * @param {string} projectRoot
 * @returns {RuleBookConfig | null}
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
 * @param {RuleBookConfig} config
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
        rulesSource: normalized.rulesSource,
        branch: normalized.branch || DEFAULT_BRANCH,
    };
    if (normalized.rulesSourceDir) {
        toWrite.rulesSourceDir = normalized.rulesSourceDir;
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
