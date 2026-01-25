import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import clipboardy from "clipboardy";
import chalk from "chalk";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default async function callCommand() {
    try {
        const templatePath = path.join(__dirname, "../prompt/copy.md");
        const content = await fs.readFile(templatePath, "utf-8");

        await clipboardy.write(content);

        console.log(chalk.green("✓ Prompt copied to clipboard"));
        console.log(chalk.dim("→ Paste it in Cursor"));
    } catch (error) {
        console.error(chalk.red("✗ Failed to copy prompt"));
        console.error(chalk.dim(error.message));
        process.exit(1);
    }
}
