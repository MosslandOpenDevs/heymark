#!/usr/bin/env node

require("./alias.js");

const { COMMAND_LINK, COMMAND_SYNC, COMMAND_CLEAN, COMMAND_HELP } = require("@/commands/constants");
const { runLink } = require("@/commands/link");
const { runSync } = require("@/commands/sync");
const { runClean } = require("@/commands/clean");
const { runHelp } = require("@/commands/help");
const { loadTools } = require("@/tools/loader");

function main() {
    const context = {
        cwd: process.cwd(),
        tools: loadTools(),
    };

    const args = process.argv.slice(2);

    if (args.length === 0) {
        runHelp([], context);
        return;
    }

    const command = args[0];
    const flags = args.slice(1);

    if (command === COMMAND_LINK) {
        runLink(flags, context);
        return;
    }

    if (command === COMMAND_SYNC) {
        runSync(flags, context);
        return;
    }

    if (command === COMMAND_CLEAN) {
        runClean(flags, context);
        return;
    }

    if (command === COMMAND_HELP) {
        runHelp(flags, context);
        return;
    }

    console.error(`[Error] Unknown command: ${command}. Run: heymark help`);
    process.exit(1);
}

main();
