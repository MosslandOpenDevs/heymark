const { cleaner } = require("@/commands/cleaner");
const { selectTools } = require("@/commands/select-tools");
const { readCache } = require("@/skill-repo/cache-folder");
const { readConfig } = require("@/skill-repo/config-file");
const { SKILL_REPO_DEFAULT_BRANCH } = require("@/skill-repo/constants");

function runSync(flags, context) {
    const selectedTools = selectTools(flags, context.tools);
    const { skills } = readCache(context.cwd);
    const config = readConfig(context.cwd);

    console.log("[Sync]");
    if (config) {
        console.log(`  repo:   ${config.repoUrl}`);
        if (config.folder) console.log(`  folder: ${config.folder}`);
        if (config.branch !== SKILL_REPO_DEFAULT_BRANCH) console.log(`  branch: ${config.branch}`);
    }
    console.log("");

    const skillNames = skills.map((s) => s.name);
    cleaner(context.tools, selectedTools, skillNames, context.cwd);

    for (const toolKey of selectedTools) {
        const tool = context.tools[toolKey];
        const count = tool.generate(skills, context.cwd);
        console.log(`  ${tool.name.padEnd(16)} -> ${tool.output} (${count} skills)`);
    }

    console.log("");
    console.log(`[Done] ${selectedTools.length} tools synced.`);
}

module.exports = {
    runSync,
};
