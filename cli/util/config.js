import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import os from "os";
import chalk from "chalk";

function getConfigPath() {
    const packageJsonPath = path.join(process.cwd(), "package.json");
    const packageJson = JSON.parse(fsSync.readFileSync(packageJsonPath, "utf-8"));
    const packageName = packageJson.name;
    return path.join(os.homedir(), `.${packageName}.json`);
}

const CONFIG_PATH = getConfigPath();

export async function getConfig() {
    try {
        const content = await fs.readFile(CONFIG_PATH, "utf-8");
        const config = JSON.parse(content);

        return {
            postsGitRemote: config.postsGitRemote,
            postsRepoPath: config.postsRepoPath,
            cliName: config.cliName,
        };
    } catch (error) {
        console.error(chalk.red("✗ Config file not found"));
        console.error(chalk.dim('Run "yarn setup" first'));
        process.exit(1);
    }
}

export async function saveConfig(config, cliName) {
    let configPath;
    if (cliName) {
        const packageJsonPath = path.join(process.cwd(), "package.json");
        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf-8"));
        const packageName = packageJson.name;
        configPath = path.join(os.homedir(), `.${packageName}.json`);
    } else {
        configPath = CONFIG_PATH;
    }
    await fs.writeFile(configPath, JSON.stringify(config, null, 2), "utf-8");
    return configPath;
}
