const { cleaner } = require("@/commands/cleaner");
const { selectTools } = require("@/commands/select-tools");
const { readCache } = require("@/skill-repo/cache-folder");

function runClean(flags, context) {
    const selectedTools = selectTools(flags, context.tools);
    const { skills } = readCache(context.cwd);

    const skillNames = skills.map((s) => s.name);
    const cleanedCount = cleaner(context.tools, selectedTools, skillNames, context.cwd);

    console.log(`[Done] ${cleanedCount} tools cleaned.`);
}

module.exports = {
    runClean,
};
