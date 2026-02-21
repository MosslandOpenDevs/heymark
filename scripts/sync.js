#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { CONFIG_RELATIVE, DEFAULT_BRANCH, loadConfig, writeConfig } = require("./lib/config");
const { loadRules } = require("./lib/parser");
const { getRulesDirFromRepo } = require("./lib/repo");

const SCRIPT_DIR = __dirname;
const PROJECT_ROOT = process.cwd();

const INIT_SUBCOMMAND = "init";
const OPTION_TOOLS = "--tools";
const OPTION_SOURCE = "--source";
const OPTION_CLEAN = "--clean";
const OPTION_PREVIEW = "--preview";
const OPTION_HELP = "--help";
const SHORT_TOOLS = "-t";
const SHORT_SOURCE = "-s";
const SHORT_CLEAN = "-c";
const SHORT_PREVIEW = "-p";
const SHORT_HELP = "-h";
const OPTION_BRANCH = "--branch";
const OPTION_DIR = "--dir";
const SHORT_BRANCH = "-b";
const SHORT_DIR = "-d";

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

function parseToolList(rawValue) {
    const parsed = rawValue
        .split(",")
        .map((tool) => tool.trim().toLowerCase())
        .filter(Boolean);

    if (parsed.length === 0) {
        exitWithError("--tools requires a comma-separated list.");
    }

    return parsed;
}

function parseArgs(availableTools) {
    const args = process.argv.slice(2);
    const config = {
        tools: Object.keys(availableTools),
        clean: false,
        preview: false,
        help: false,
        source: null,
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        if (arg === OPTION_TOOLS || arg === SHORT_TOOLS) {
            const value = args[++i];
            if (!value) {
                exitWithError("--tools requires a comma-separated list.");
            }
            config.tools = parseToolList(value);
        } else if (arg === OPTION_CLEAN || arg === SHORT_CLEAN) {
            config.clean = true;
        } else if (arg === OPTION_PREVIEW || arg === SHORT_PREVIEW) {
            config.preview = true;
        } else if (arg === OPTION_SOURCE || arg === SHORT_SOURCE) {
            const value = args[++i];
            if (!value) {
                exitWithError("--source requires a GitHub repository URL.");
            }
            config.source = value.trim();
        } else if (arg === OPTION_HELP || arg === SHORT_HELP) {
            config.help = true;
        } else {
            exitWithError(`Unknown option: ${arg}`, ["Use --help for usage information."]);
        }
    }

    const invalidTools = config.tools.filter((tool) => !availableTools[tool]);
    if (invalidTools.length > 0) {
        exitWithError(`Unknown tool(s): ${invalidTools.join(", ")}`, [
            `Available: ${Object.keys(availableTools).join(", ")}`,
        ]);
    }

    return config;
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
AI Coding Tool Convention Sync

Reads *.md from a GitHub repository (public or private) and generates
tool-specific configuration files for various AI coding assistants.
Same rules everywhere: A computer, B computer, same remote repo.

Usage:
  heymark init <repo-url>     Set rules source (creates ${CONFIG_RELATIVE})
  heymark [options]           Sync from configured or --source repo

Options:
  --source, -s <url>   GitHub repo URL for this run (overrides ${CONFIG_RELATIVE})
  --tools, -t <list>   Comma-separated tool names (default: all)
  --clean, -c          Remove all generated files
  --preview, -p        Preview what will be generated without writing
  --help, -h           Show this help message

Rules source (in order):
  1. --source <repo-url>
  2. ${CONFIG_RELATIVE} (set via 'heymark init <repo-url>')
  Private repos: use SSH (git@github.com:org/repo.git) or HTTPS with token.

Available tools:
${toolLines}

Examples:
  heymark init https://github.com/org/my-rules.git
  heymark init https://github.com/org/my-rules.git --dir rules --branch main
  heymark
  heymark -s https://github.com/org/other-rules.git
  heymark -t cursor,claude
  heymark -c
  heymark -p
`);
}

function parseInitArgs(initArgs) {
    const repoUrl = initArgs[0];
    if (!repoUrl || repoUrl.startsWith("--")) {
        exitWithError("init requires a GitHub repository URL.", [
            "Example: heymark init https://github.com/org/my-rules.git",
            "Example: heymark init git@github.com:org/my-rules.git",
            "Optional: --branch <branch>  --dir <subdir>  (e.g. --dir rules)",
        ]);
    }

    let branch = DEFAULT_BRANCH;
    let rulesSourceDir = "";

    for (let i = 1; i < initArgs.length; i++) {
        const arg = initArgs[i];

        if (arg === OPTION_BRANCH || arg === SHORT_BRANCH) {
            const value = initArgs[++i];
            if (!value) {
                exitWithError("--branch requires a branch name.");
            }
            branch = value.trim();
            continue;
        }

        if (arg === OPTION_DIR || arg === SHORT_DIR) {
            const value = initArgs[++i];
            if (!value) {
                exitWithError("--dir requires a directory path.");
            }
            rulesSourceDir = value.trim();
            continue;
        }

        exitWithError(`Unknown option for init: ${arg}`);
    }

    return { rulesSource: repoUrl.trim(), branch, rulesSourceDir };
}

function runInit(initArgs) {
    const config = parseInitArgs(initArgs);
    const configPath = writeConfig(PROJECT_ROOT, config);

    console.log(
        `[Init] Rules source saved to ${path.relative(PROJECT_ROOT, configPath) || configPath}`
    );
    console.log(`  rulesSource: ${config.rulesSource}`);
    if (config.branch !== DEFAULT_BRANCH) {
        console.log(`  branch: ${config.branch}`);
    }
    if (config.rulesSourceDir) {
        console.log(`  rulesSourceDir: ${config.rulesSourceDir}`);
    }
    console.log("");
    console.log("Run 'heymark' to fetch rules from the repo and generate tool configs.");
}

function resolveRulesDir(config) {
    const repoConfig = config.source
        ? { rulesSource: config.source, branch: DEFAULT_BRANCH, rulesSourceDir: "" }
        : loadConfig(PROJECT_ROOT);

    if (!repoConfig) {
        return null;
    }

    return getRulesDirFromRepo(PROJECT_ROOT, repoConfig);
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

function main() {
    const args = process.argv.slice(2);
    const subcommand = args[0];
    if (subcommand === INIT_SUBCOMMAND) {
        runInit(args.slice(1));
        return;
    }

    const tools = discoverTools();
    const config = parseArgs(tools);

    if (config.help) {
        showHelp(tools);
        return;
    }

    const rulesSourceDir = resolveRulesDir(config);
    if (!rulesSourceDir) {
        console.error("[Error] Rules source not set.");
        console.error("  Run: heymark init <github-repo-url>");
        console.error("  Example: heymark init https://github.com/org/my-rules.git");
        console.error("  Or use: heymark --source <repo-url>");
        process.exit(1);
    }

    const rulesRelPath = path.relative(PROJECT_ROOT, rulesSourceDir) || ".";

    console.log("[Sync] Starting convention sync...");
    console.log(`  Source:  ${rulesRelPath} (from remote repo)`);
    console.log(`  Target:  ${PROJECT_ROOT}`);
    console.log(`  Tools:   ${config.tools.join(", ")}`);
    console.log("");

    const rules = loadRules(rulesSourceDir);
    console.log(`[Load] ${rules.length} rule(s): ${rules.map((rule) => rule.name).join(", ")}`);
    console.log("");

    const ruleNames = rules.map((rule) => rule.name);

    if (config.clean) {
        console.log("[Clean] Removing generated files...");
        cleanGeneratedFiles(tools, config.tools, ruleNames, false);
        console.log("");
        console.log(`[Done] Cleaned ${config.tools.length} tool(s) successfully.`);
        return;
    }

    if (config.preview) {
        console.log("[Preview] Would generate:");
        for (const toolKey of config.tools) {
            const toolDefinition = tools[toolKey];
            const summary = `${toolDefinition.name.padEnd(16)} -> ${toolDefinition.output}`;
            console.log(`  ${summary} (${rules.length} rules)`);
        }
        return;
    }

    // Ensure regenerated output is always fresh.
    console.log("[Clean] Removing existing generated files...");
    cleanGeneratedFiles(tools, config.tools, ruleNames, true);
    console.log("");

    console.log("[Generate]");
    for (const toolKey of config.tools) {
        const toolDefinition = tools[toolKey];
        const count = toolDefinition.generate(rules, PROJECT_ROOT);
        const summary = `${toolDefinition.name.padEnd(16)} -> ${toolDefinition.output}`;
        console.log(`  ${summary} (${count} rules)`);
    }

    console.log("");
    console.log(`[Done] ${config.tools.length} tool(s) synced successfully.`);
}

main();
