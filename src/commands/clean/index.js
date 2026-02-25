const { cleaner } = require("@/commands/cleaner");
const { selectTools } = require("@/commands/select-tools");
const { readCache } = require("@/skill-repo/cache-folder");

function extractDryRun(flags) {
    const dryRunFlags = new Set(["--dry-run", "-n"]);
    const dryRun = flags.some((flag) => dryRunFlags.has(flag));
    const positional = flags.filter((flag) => !dryRunFlags.has(flag));
    return { dryRun, positional };
}

function runClean(flags, context) {
    const { dryRun, positional } = extractDryRun(flags);
    const selectedTools = selectTools(positional, context.tools);
    const { skills } = readCache(context.cwd);

    const previousDryRun = process.env.HEYMARK_DRY_RUN;
    if (dryRun) {
        process.env.HEYMARK_DRY_RUN = "1";
        console.log("[Clean]");
        console.log("  mode:   dry-run (no files will be removed)");
        console.log("");
    }

    const skillNames = skills.map((s) => s.name);
    const cleanedCount = cleaner(context.tools, selectedTools, skillNames, context.cwd);

    if (dryRun) {
        if (previousDryRun === undefined) delete process.env.HEYMARK_DRY_RUN;
        else process.env.HEYMARK_DRY_RUN = previousDryRun;
    }

    console.log(`[Done] ${cleanedCount} tools cleaned${dryRun ? " (dry-run)" : ""}.`);
}

module.exports = {
    runClean,
};
