#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { loadRules } = require("./lib/parser");

const SCRIPT_DIR = __dirname;
const REPO_DIR = path.resolve(SCRIPT_DIR, "..");
const RULES_SRC_DIR = path.join(REPO_DIR, "rules");
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

Reads rules/*.md from the repository and generates tool-specific
configuration files for various AI coding assistants.
New tools can be added by creating a module in scripts/tools/.

Usage: node scripts/sync.js [options]

Options:
  --tools, -t <list>  Comma-separated tool names (default: all)
  --clean, -c         Remove all generated files
  --preview, -p       Preview what will be generated without writing
  --help, -h          Show this help message

Available tools:
${toolLines}

Note:
  By default, the sync process automatically cleans existing files
  before generating new ones to ensure a fresh sync.

Examples:
  node scripts/sync.js                       # Clean & generate all tools
  node scripts/sync.js -t cursor,claude      # Clean & generate Cursor + Claude only
  node scripts/sync.js -c                    # Clean all generated files only
  node scripts/sync.js -p                    # Preview (no write)
`);
}

function main() {
    const tools = discoverTools();
    const config = parseArgs(tools);

    if (config.help) {
        showHelp(tools);
        return;
    }

    const rulesRelPath = path.relative(PROJECT_ROOT, RULES_SRC_DIR) || ".";

    console.log("[Sync] Starting convention sync...");
    console.log(`  Source:  ${rulesRelPath}`);
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
