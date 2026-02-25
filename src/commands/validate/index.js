const { readCache } = require("@/skill-repo/cache-folder");

function runValidate(flags, context) {
    if (flags.length > 0) {
        console.error(`[Error] Unknown: ${flags.join(", ")}. validate takes no arguments.`);
        process.exit(1);
    }

    const { skills } = readCache(context.cwd, { update: false });
    const errors = [];
    const seenNames = new Set();

    for (const skill of skills) {
        const label = `${skill.fileName}`;

        if (!skill.metadata || typeof skill.metadata.description !== "string" || !skill.metadata.description.trim()) {
            errors.push(`[${label}] Missing required frontmatter key: description`);
        }

        if (
            skill.metadata
            && Object.prototype.hasOwnProperty.call(skill.metadata, "alwaysApply")
            && typeof skill.metadata.alwaysApply !== "boolean"
        ) {
            errors.push(`[${label}] alwaysApply must be boolean (true/false)`);
        }

        if (
            skill.metadata
            && Object.prototype.hasOwnProperty.call(skill.metadata, "globs")
            && typeof skill.metadata.globs !== "string"
        ) {
            errors.push(`[${label}] globs must be a string`);
        }

        const normalizedName = (skill.name || "").trim().toLowerCase();
        if (!normalizedName) {
            errors.push(`[${label}] Skill name is empty`);
        } else if (seenNames.has(normalizedName)) {
            errors.push(`[${label}] Duplicate skill name detected: ${skill.name}`);
        } else {
            seenNames.add(normalizedName);
        }
    }

    if (errors.length > 0) {
        console.error("[Validate] Failed");
        errors.forEach((error) => console.error(`  - ${error}`));
        process.exit(1);
    }

    console.log(`[Validate] OK (${skills.length} skills)`);
}

module.exports = {
    runValidate,
};
