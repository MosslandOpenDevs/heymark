const path = require("path");
const { writeConfig } = require("@/skill-repo/config-file");
const { SKILL_REPO_DEFAULT_BRANCH } = require("@/skill-repo/constants");
const branch = require("@/commands/link/flags/branch");
const folder = require("@/commands/link/flags/folder");

function parseFlags(flags, handlers) {
    const result = {};
    for (let i = 0; i < flags.length; i++) {
        const flag = flags[i];
        const handler = handlers.find((h) => h.is(flag));
        if (handler) {
            const parsed = handler.parse(flags, i);
            result[handler.key] = parsed.value;
            i += parsed.advance;
            continue;
        }
        console.error(`[Error] Unknown flag: ${flag}`);
        process.exit(1);
    }
    return result;
}

function parseConfig(flags) {
    const repoUrl = flags[0];
    if (!repoUrl || repoUrl.startsWith("--")) {
        console.error(
            "[Error] Provide a repo URL. Example: heymark link https://github.com/org/repo.git"
        );
        process.exit(1);
    }

    const parsed = parseFlags(flags.slice(1), [branch, folder]);

    return {
        repoUrl: repoUrl.trim(),
        branch: parsed.branch || SKILL_REPO_DEFAULT_BRANCH,
        folder: parsed.folder || "",
    };
}

function runLink(flags, context) {
    const config = parseConfig(flags);
    const configPath = writeConfig(context.cwd, config);

    console.log(`[Link] Saved to ${path.relative(context.cwd, configPath) || configPath}`);
    console.log(`  repo: ${config.repoUrl}`);
    if (config.branch !== SKILL_REPO_DEFAULT_BRANCH) {
        console.log(`  branch: ${config.branch}`);
    }
    if (config.folder) {
        console.log(`  folder: ${config.folder}`);
    }
}

module.exports = {
    runLink,
};
