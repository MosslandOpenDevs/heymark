import inquirer from "inquirer";
import { saveConfig } from "./util/config.js";
import chalk from "chalk";
import path from "path";
import fs from "fs/promises";

async function setup() {
    console.log(chalk.bold("\n🗂️  Heymark CLI Setup\n"));
    console.log(chalk.dim("Please provide the following information:\n"));

    const answers = await inquirer.prompt([
        {
            type: "input",
            name: "cliName",
            message: "CLI command name:",
            default: "heymark",
            validate: (input) => {
                if (!input || input.trim() === "") {
                    return "CLI command name is required";
                }
                if (!/^[a-z0-9-]+$/.test(input)) {
                    return "CLI command name can only contain lowercase letters, numbers, and hyphens";
                }
                return true;
            },
        },
        {
            type: "input",
            name: "postsGitRemote",
            message: "Posts Git repository URL:",
        },
        {
            type: "input",
            name: "postsRepoPath",
            message: "Posts folder (local absolute path):",
            validate: (input) => {
                if (!input || input.trim() === "") {
                    return "Posts folder path is required";
                }
                if (!path.isAbsolute(input)) {
                    return "Please provide an absolute path";
                }
                return true;
            },
        },
    ]);

    const packageJsonPath = path.join(process.cwd(), "package.json");
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf-8"));

    packageJson.bin = {
        [answers.cliName]: "./cli/index.js",
    };

    // yarn link 충돌 방지
    packageJson.name = `${answers.cliName}-cli`;

    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 4), "utf-8");

    const configPath = await saveConfig(
        {
            cliName: answers.cliName,
            postsGitRemote: answers.postsGitRemote,
            postsRepoPath: answers.postsRepoPath,
        },
        answers.cliName
    );

    console.log(
        chalk.green(`\n✓ Setup complete: CLI '${answers.cliName}' configured (${configPath})`)
    );
    console.log(chalk.dim("\nNext steps:"));
    console.log(chalk.dim("  1. yarn link"));
    console.log(chalk.dim(`  2. ${answers.cliName} call`));
}

setup().catch((error) => {
    console.error(chalk.red("\n✗ Setup failed"));
    console.error(chalk.dim(error.message));
    process.exit(1);
});
