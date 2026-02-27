function buildDryRunSummary(tools, selectedTools, skills, cwd) {
    const perTool = [];
    const totals = { created: 0, updated: 0, deleted: 0 };

    for (const toolKey of selectedTools) {
        const tool = tools[toolKey];
        const preview = typeof tool.preview === "function" ? tool.preview(skills, cwd) : {};
        const created = Array.isArray(preview.created) ? preview.created.slice().sort() : [];
        const updated = Array.isArray(preview.updated) ? preview.updated.slice().sort() : [];
        const deleted = Array.isArray(preview.deleted) ? preview.deleted.slice().sort() : [];

        perTool.push({
            toolName: tool.name,
            created,
            updated,
            deleted,
        });

        totals.created += created.length;
        totals.updated += updated.length;
        totals.deleted += deleted.length;
    }

    return { perTool, totals };
}

function printDryRunSummary(summary) {
    console.log("");
    console.log("[Dry-run Summary]");

    for (const row of summary.perTool) {
        console.log(
            `  ${row.toolName.padEnd(16)} create:${String(row.created.length).padStart(3)} update:${String(row.updated.length).padStart(3)} delete:${String(row.deleted.length).padStart(3)}`
        );
        row.created.forEach((p) => console.log(`    + ${p}`));
        row.updated.forEach((p) => console.log(`    ~ ${p}`));
        row.deleted.forEach((p) => console.log(`    - ${p}`));
    }

    console.log(
        `  ${"TOTAL".padEnd(16)} create:${String(summary.totals.created).padStart(3)} update:${String(summary.totals.updated).padStart(3)} delete:${String(summary.totals.deleted).padStart(3)}`
    );
}

module.exports = {
    buildDryRunSummary,
    printDryRunSummary,
};
