import { exec } from "child_process";
import { promisify } from "util";
import chalk from "chalk";
import { getConfig } from "../util/config.js";

const execAsync = promisify(exec);

export default async function openCommand() {
    try {
        const config = await getConfig();

        console.log(chalk.dim("Opening posts repo in Cursor..."));
        await execAsync(`cursor "${config.postsRepoPath}"`);

        console.log(chalk.green("✓ Opening posts repo in Cursor..."));
    } catch (error) {
        console.error(chalk.red("✗ Failed to open posts repo"));
        console.error(chalk.dim(error.message));
        process.exit(1);
    }
}
