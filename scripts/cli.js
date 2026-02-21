#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { CONFIG_RELATIVE, DEFAULT_BRANCH, loadConfig, writeConfig } = require("./lib/config");
const { loadRules } = require("./lib/parser");
const { CACHE_DIR_NAME, getLinkedRulesDir, sanitizeRepoName } = require("./lib/repo");

const SCRIPT_DIR = __dirname;
const PROJECT_ROOT = process.cwd();

const COMMAND_LINK = "link";
const COMMAND_SYNC = "sync";
const COMMAND_CLEAN = "clean";
const COMMAND_STATUS = "status";
const COMMAND_HELP = "help";

const OPTION_BRANCH = "--branch";
const OPTION_FOLDER = "--folder";
const OPTION_SAMPLES = "--samples";
const SHORT_BRANCH = "-b";
const SHORT_FOLDER = "-f";
const TARGET_ALL = "all";
const TARGET_DOT = ".";
const LATEST_VERSION_COMMAND = "npx heymark@latest";
const SAMPLES_REPO_URL = "https://github.com/MosslandOpenDevs/heymark.git";
const SAMPLES_FOLDER = "samples";

function exitWithError(message, details = []) {
    console.error(`[Error] ${message}`);
    details.forEach((detail) => console.error(`  ${detail}`));
    process.exit(1);
}

function discoverTools() {
    const toolsDir = path.join(SCRIPT_DIR, "tools");
    const registry = {};

    fs.readdirSync(toolsDir)
        .filter((fileName) => fileName.endsWith(".js"))
        .sort()
        .forEach((file) => {
            const key = path.basename(file, ".js");
            registry[key] = require(path.join(toolsDir, file));
        });

    return registry;
}

function showHelp(tools) {
    const toolLines = Object.entries(tools)
        .map(([toolKey, toolDefinition]) => {
            const paddedKey = toolKey.padEnd(10);
            const paddedName = toolDefinition.name.padEnd(16);
            return `  ${paddedKey} ${paddedName} -> ${toolDefinition.output}`;
        })
        .join("\n");

    console.log(`
Heymark CLI

Reads *.md from a GitHub repository (public or private) and generates
tool-specific configuration files for various AI coding assistants.
Same rules everywhere: A computer, B computer, same remote repo.

Usage:
  heymark help
  heymark link <repo-url> [--branch <name>] [--folder <path>]
  heymark link --samples
  heymark sync [.|<tool>...]
  heymark clean [.|<tool>...]
  heymark status
  heymark

Options:
  --branch, -b <name>  Branch name (used with 'link')
  --folder, -f <path>  Subdirectory path in repository (used with 'link')
  --samples            Use built-in sample Skill repository

Targets:
  .                    All available tools
  <tool>...            Space-separated tool names (no commas)

Available tools:
${toolLines}

Examples:
  heymark help
  heymark link --samples
  heymark link https://github.com/org/my-rules.git
  heymark link https://github.com/org/my-rules.git --folder rules --branch main
  heymark sync .
  heymark sync cursor claude
  heymark clean .
  heymark status
  heymark

Latest version:
  ${LATEST_VERSION_COMMAND}
`);
}

function parseLinkArgs(args) {
    if (args.length === 1 && args[0] === OPTION_SAMPLES) {
        return {
            repoUrl: SAMPLES_REPO_URL,
            branch: DEFAULT_BRANCH,
            folder: SAMPLES_FOLDER,
        };
    }

    if (args.includes(OPTION_SAMPLES)) {
        exitWithError("--samples cannot be combined with other link arguments.", [
            "Use: heymark link --samples",
        ]);
    }

    const repoUrl = args[0];
    if (!repoUrl || repoUrl.startsWith("--")) {
        exitWithError("link requires a GitHub repository URL.", [
            "Example: heymark link https://github.com/org/my-rules.git",
            "Example: heymark link git@github.com:org/my-rules.git",
            "Optional: --branch <branch>  --folder <subdir>  (e.g. --folder rules)",
        ]);
    }

    let branch = DEFAULT_BRANCH;
    let folder = "";

    for (let i = 1; i < args.length; i++) {
        const arg = args[i];

        if (arg === OPTION_BRANCH || arg === SHORT_BRANCH) {
            const value = args[++i];
            if (!value) {
                exitWithError("--branch requires a branch name.");
            }
            branch = value.trim();
            continue;
        }

        if (arg === OPTION_FOLDER || arg === SHORT_FOLDER) {
            const value = args[++i];
            if (!value) {
                exitWithError("--folder requires a folder path.");
            }
            folder = value.trim();
            continue;
        }

        exitWithError(`Unknown option for link: ${arg}`);
    }

    return { repoUrl: repoUrl.trim(), branch, folder };
}

function runLink(args) {
    const config = parseLinkArgs(args);
    const configPath = writeConfig(PROJECT_ROOT, config);

    console.log(
        `[Link] Linked repository saved to ${path.relative(PROJECT_ROOT, configPath) || configPath}`
    );
    console.log(`  repoUrl: ${config.repoUrl}`);
    if (config.branch !== DEFAULT_BRANCH) {
        console.log(`  branch: ${config.branch}`);
    }
    if (config.folder) {
        console.log(`  folder: ${config.folder}`);
    }
    console.log("");
    console.log("Run 'heymark sync .' to fetch rules and generate tool configs.");
}

function loadLinkedConfigOrExit() {
    const linkedConfig = loadConfig(PROJECT_ROOT);
    if (linkedConfig) {
        return linkedConfig;
    }

    exitWithError("No linked repository found.", [
        `Run: heymark ${COMMAND_LINK} <github-repo-url>`,
        `Config: ${CONFIG_RELATIVE}`,
    ]);
}

function resolveSelectedTools(toolArgs, availableTools) {
    const availableToolKeys = Object.keys(availableTools);
    if (toolArgs.length === 0) {
        return availableToolKeys;
    }

    const selectedTools = toolArgs.map((tool) => tool.trim().toLowerCase()).filter(Boolean);
    if (selectedTools.length === 0) {
        return availableToolKeys;
    }

    if (selectedTools.some((tool) => tool.includes(","))) {
        exitWithError("Tool names must be space-separated (no commas).", [
            "Example: heymark sync cursor claude",
        ]);
    }

    const hasDotToken = selectedTools.includes(TARGET_DOT);
    const hasAllToken = selectedTools.includes(TARGET_ALL);

    if (hasAllToken) {
        exitWithError("'all' is not supported. Use '.' for all tools.");
    }

    if (hasDotToken) {
        if (selectedTools.length > 1) {
            exitWithError(`'${TARGET_DOT}' cannot be combined with tool names.`);
        }
        return availableToolKeys;
    }

    const invalidTools = selectedTools.filter((tool) => !availableTools[tool]);
    if (invalidTools.length > 0) {
        exitWithError(`Unknown tool(s): ${invalidTools.join(", ")}`, [
            `Available: ${availableToolKeys.join(", ")}`,
        ]);
    }

    return Array.from(new Set(selectedTools));
}

function cleanGeneratedFiles(tools, selectedTools, ruleNames, onlyPrintWhenDeleted) {
    for (const toolKey of selectedTools) {
        const cleanedPaths = tools[toolKey].clean(ruleNames, PROJECT_ROOT);
        if (onlyPrintWhenDeleted && cleanedPaths.length === 0) {
            continue;
        }

        cleanedPaths.forEach((filePath) => {
            console.log(`  Deleted: ${filePath}`);
        });
    }
}

function loadRulesFromLinkedRepo() {
    const linkedConfig = loadLinkedConfigOrExit();
    const rulesDir = getLinkedRulesDir(PROJECT_ROOT, linkedConfig);
    const rules = loadRules(rulesDir);
    return { linkedConfig, rulesDir, rules };
}

function printSyncContext(selectedTools, rulesDir) {
    const rulesRelPath = path.relative(PROJECT_ROOT, rulesDir) || ".";
    console.log("[Sync] Starting convention sync...");
    console.log(`  Source:  ${rulesRelPath} (from linked repo)`);
    console.log(`  Target:  ${PROJECT_ROOT}`);
    console.log(`  Tools:   ${selectedTools.join(", ")}`);
    console.log("");
}

function runSync(toolArgs, tools) {
    const selectedTools = resolveSelectedTools(toolArgs, tools);
    const { rulesDir, rules } = loadRulesFromLinkedRepo();
    printSyncContext(selectedTools, rulesDir);

    console.log(`[Load] ${rules.length} rule(s): ${rules.map((rule) => rule.name).join(", ")}`);
    console.log("");

    const ruleNames = rules.map((rule) => rule.name);

    // Ensure regenerated output is always fresh.
    console.log("[Clean] Removing existing generated files...");
    cleanGeneratedFiles(tools, selectedTools, ruleNames, true);
    console.log("");

    console.log("[Generate]");
    for (const toolKey of selectedTools) {
        const toolDefinition = tools[toolKey];
        const count = toolDefinition.generate(rules, PROJECT_ROOT);
        const summary = `${toolDefinition.name.padEnd(16)} -> ${toolDefinition.output}`;
        console.log(`  ${summary} (${count} rules)`);
    }

    console.log("");
    console.log(`[Done] ${selectedTools.length} tool(s) synced successfully.`);
}

function runClean(toolArgs, tools) {
    const selectedTools = resolveSelectedTools(toolArgs, tools);
    const { rulesDir, rules } = loadRulesFromLinkedRepo();
    const rulesRelPath = path.relative(PROJECT_ROOT, rulesDir) || ".";

    console.log("[Clean] Removing generated files...");
    console.log(`  Source: ${rulesRelPath} (from linked repo)`);
    console.log(`  Tools:  ${selectedTools.join(", ")}`);
    console.log("");

    const ruleNames = rules.map((rule) => rule.name);
    cleanGeneratedFiles(tools, selectedTools, ruleNames, false);

    console.log("");
    console.log(`[Done] ${selectedTools.length} tool(s) cleaned successfully.`);
}

function runStatus(tools) {
    const linkedConfig = loadConfig(PROJECT_ROOT);
    const toolKeys = Object.keys(tools);

    console.log("[Status] Heymark");
    console.log(`  Project: ${PROJECT_ROOT}`);
    console.log(`  Config:  ${CONFIG_RELATIVE}`);
    console.log(`  Tools:   ${toolKeys.join(", ")}`);
    console.log(`  Latest:  ${LATEST_VERSION_COMMAND}`);
    console.log("");

    if (!linkedConfig) {
        console.log("No repository is linked yet.");
        console.log(`Run: heymark ${COMMAND_LINK} <github-repo-url>`);
        return;
    }

    const cachePath = path.join(
        PROJECT_ROOT,
        CACHE_DIR_NAME,
        sanitizeRepoName(linkedConfig.repoUrl)
    );
    const cacheState = fs.existsSync(cachePath) ? "ready" : "not-fetched";

    console.log("Linked repository:");
    console.log(`  repoUrl: ${linkedConfig.repoUrl}`);
    console.log(`  branch:  ${linkedConfig.branch || DEFAULT_BRANCH}`);
    console.log(`  folder:  ${linkedConfig.folder || "(root)"}`);
    console.log(`  cache:   ${cacheState}`);
}

function main() {
    const tools = discoverTools();
    const args = process.argv.slice(2);

    if (args.length === 0) {
        runStatus(tools);
        return;
    }

    const command = args[0];
    const commandArgs = args.slice(1);

    if (command === COMMAND_LINK) {
        runLink(commandArgs);
        return;
    }
    if (command === COMMAND_SYNC) {
        runSync(commandArgs, tools);
        return;
    }
    if (command === COMMAND_CLEAN) {
        runClean(commandArgs, tools);
        return;
    }
    if (command === COMMAND_STATUS) {
        if (commandArgs.length > 0) {
            exitWithError("status does not accept arguments.");
        }
        runStatus(tools);
        return;
    }
    if (command === COMMAND_HELP) {
        if (commandArgs.length > 0) {
            exitWithError("help does not accept arguments.");
        }
        showHelp(tools);
        return;
    }

    exitWithError(`Unknown command: ${command}`, ["Use 'heymark help' for usage information."]);
}

main();
