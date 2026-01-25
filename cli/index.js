#!/usr/bin/env node
import { Command } from "commander";
import callCommand from "./command/call.js";
import addCommand from "./command/add.js";
import openCommand from "./command/open.js";
import { getConfig } from "./util/config.js";

const config = await getConfig();

const program = new Command();

program
    .name(config.cliName)
    .description(`${config.cliName} CLI - Personal knowledge management`)
    .version("1.0.0");

program.command("call").description("Copy prompt to clipboard").action(callCommand);

program
    .command("add <filepath>")
    .description("Add document to heymark")
    .option("-d, --delete", "Delete original file after adding")
    .action(addCommand);

program.command("open").description("Open posts repo in Cursor").action(openCommand);

program.parse();
