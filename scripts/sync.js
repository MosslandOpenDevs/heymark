#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { loadRules } = require("./lib/parser");
const { CONFIG_RELATIVE, loadConfig, writeConfig } = require("./lib/config");
const { getRulesDirFromRepo } = require("./lib/repo");

const SCRIPT_DIR = __dirname;
const PROJECT_ROOT = process.cwd();

function discoverTools() {
    const toolsDir = path.join(SCRIPT_DIR, "tools");
    const registry = {};

    fs.readdirSync(toolsDir)
        .filter((f) => f.endsWith(".js"))
        .sort()
        .forEach((file) => {
            const key = path.basename(file, ".js");
            registry[key] = require(path.join(toolsDir, file));
        });

    return registry;
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

        if (arg === "--tools" || arg === "-t") {
            const val = args[++i];
            if (!val) {
                console.error("[Error] --tools requires a comma-separated list.");
                process.exit(1);
            }
            config.tools = val.split(",").map((t) => t.trim().toLowerCase());
        } else if (arg === "--clean" || arg === "-c") {
            config.clean = true;
        } else if (arg === "--preview" || arg === "-p") {
            config.preview = true;
        } else if (arg === "--source" || arg === "-s") {
            const val = args[++i];
            if (!val) {
                console.error("[Error] --source requires a GitHub repository URL.");
                process.exit(1);
            }
            config.source = val.trim();
        } else if (arg === "--help" || arg === "-h") {
            config.help = true;
        } else {
            console.error(`[Error] Unknown option: ${arg}`);
            console.error("  Use --help for usage information.");
            process.exit(1);
        }
    }

    const invalid = config.tools.filter((t) => !availableTools[t]);
    if (invalid.length > 0) {
        console.error(`[Error] Unknown tool(s): ${invalid.join(", ")}`);
        console.error(`  Available: ${Object.keys(availableTools).join(", ")}`);
        process.exit(1);
    }

    return config;
}

function showHelp(tools) {
    const toolLines = Object.entries(tools)
        .map(([key, t]) => `  ${key.padEnd(10)} ${t.name.padEnd(16)} -> ${t.output}`)
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

function runInit(initArgs) {
    const args = initArgs.slice(0);
    const repoUrl = args[0];
    if (!repoUrl || repoUrl.startsWith("--")) {
        console.error("[Error] init requires a GitHub repository URL.");
        console.error("  Example: heymark init https://github.com/org/my-rules.git");
        console.error("  Example: heymark init git@github.com:org/my-rules.git");
        console.error("  Optional: --branch <branch>  --dir <subdir>  (e.g. --dir rules)");
        process.exit(1);
    }
    let branch = "main";
    let rulesSourceDir = "";
    for (let i = 1; i < args.length; i++) {
        if ((args[i] === "--branch" || args[i] === "-b") && args[i + 1]) {
            branch = args[++i].trim();
        } else if ((args[i] === "--dir" || args[i] === "-d") && args[i + 1]) {
            rulesSourceDir = args[++i].trim();
        }
    }
    const config = { rulesSource: repoUrl.trim(), branch, rulesSourceDir };
    const configPath = writeConfig(PROJECT_ROOT, config);
    console.log(
        `[Init] Rules source saved to ${path.relative(PROJECT_ROOT, configPath) || configPath}`
    );
    console.log(`  rulesSource: ${config.rulesSource}`);
    if (branch !== "main") console.log(`  branch: ${branch}`);
    if (rulesSourceDir) console.log(`  rulesSourceDir: ${rulesSourceDir}`);
    console.log("");
    console.log("Run 'heymark' to fetch rules from the repo and generate tool configs.");
}

function resolveRulesDir(config) {
    const repoConfig = config.source
        ? { rulesSource: config.source, branch: "main", rulesSourceDir: "" }
        : loadConfig(PROJECT_ROOT);
    if (!repoConfig) return null;
    return getRulesDirFromRepo(PROJECT_ROOT, repoConfig);
}

function main() {
    const args = process.argv.slice(2);
    const subcommand = args[0];
    if (subcommand === "init") {
        runInit(args.slice(1));
        return;
    }

    const tools = discoverTools();
    const config = parseArgs(tools);

    if (config.help) {
        showHelp(tools);
        return;
    }

    const RULES_SRC_DIR = resolveRulesDir(config);
    if (!RULES_SRC_DIR) {
        console.error("[Error] Rules source not set.");
        console.error("  Run: heymark init <github-repo-url>");
        console.error("  Example: heymark init https://github.com/org/my-rules.git");
        console.error("  Or use: heymark --source <repo-url>");
        process.exit(1);
    }

    const rulesRelPath = path.relative(PROJECT_ROOT, RULES_SRC_DIR) || ".";

    console.log("[Sync] Starting convention sync...");
    console.log(`  Source:  ${rulesRelPath} (from remote repo)`);
    console.log(`  Target:  ${PROJECT_ROOT}`);
    console.log(`  Tools:   ${config.tools.join(", ")}`);
    console.log("");

    const rules = loadRules(RULES_SRC_DIR);
    console.log(`[Load] ${rules.length} rule(s): ${rules.map((r) => r.name).join(", ")}`);
    console.log("");

    if (config.clean) {
        console.log("[Clean] Removing generated files...");
        const ruleNames = rules.map((r) => r.name);
        for (const key of config.tools) {
            const cleaned = tools[key].clean(ruleNames, PROJECT_ROOT);
            cleaned.forEach((p) => console.log(`  Deleted: ${p}`));
        }
        console.log("");
        console.log(`[Done] Cleaned ${config.tools.length} tool(s) successfully.`);
        return;
    }

    if (config.preview) {
        console.log("[Preview] Would generate:");
        for (const key of config.tools) {
            const t = tools[key];
            console.log(`  ${t.name.padEnd(16)} -> ${t.output} (${rules.length} rules)`);
        }
        return;
    }

    // Clean existing files before generating (for fresh sync)
    console.log("[Clean] Removing existing generated files...");
    const ruleNames = rules.map((r) => r.name);
    for (const key of config.tools) {
        const cleaned = tools[key].clean(ruleNames, PROJECT_ROOT);
        if (cleaned.length > 0) {
            cleaned.forEach((p) => console.log(`  Deleted: ${p}`));
        }
    }
    console.log("");

    console.log("[Generate]");
    for (const key of config.tools) {
        const t = tools[key];
        const count = t.generate(rules, PROJECT_ROOT);
        console.log(`  ${t.name.padEnd(16)} -> ${t.output} (${count} rules)`);
    }

    console.log("");
    console.log(`[Done] ${config.tools.length} tool(s) synced successfully.`);
}

main();
