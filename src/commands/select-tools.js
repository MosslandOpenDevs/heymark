const ALL_TOOLS_TOKEN = ".";

function selectTools(flags, availableTools) {
    const availableToolKeys = Object.keys(availableTools);
    if (flags.length === 0) {
        return availableToolKeys;
    }

    if (flags.some((tool) => tool.includes(","))) {
        console.error("[Error] Use spaces between tools, not commas.");
        process.exit(1);
    }

    if (flags.includes(ALL_TOOLS_TOKEN)) {
        if (flags.length > 1) {
            console.error("[Error] Use '.' alone for all tools.");
            process.exit(1);
        }
        return availableToolKeys;
    }

    const invalid = flags.filter((tool) => !availableTools[tool]);
    if (invalid.length > 0) {
        console.error(
            `[Error] Unknown: ${invalid.join(", ")}. Available: ${availableToolKeys.join(", ")}`
        );
        process.exit(1);
    }

    return Array.from(new Set(flags));
}

module.exports = {
    selectTools,
};
