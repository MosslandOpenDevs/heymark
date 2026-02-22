function cleaner(tools, selectedTools, skillNames, cwd) {
    let headerPrinted = false;
    let cleanedCount = 0;

    for (const toolKey of selectedTools) {
        const cleanedPaths = tools[toolKey].clean(skillNames, cwd);
        if (cleanedPaths.length === 0) continue;

        if (!headerPrinted) {
            console.log("[Clean]");
            headerPrinted = true;
        }

        cleanedPaths.forEach((p) => console.log(`  Removed: ${p}`));
        cleanedCount++;
    }

    if (headerPrinted) {
        console.log("");
    }

    return cleanedCount;
}

module.exports = {
    cleaner,
};
