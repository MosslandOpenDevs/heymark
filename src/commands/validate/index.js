const { readCache } = require("@/skill-repo/cache-folder");

function parseValidateFlags(flags) {
    const jsonFlags = new Set(["--json"]);
    const unknownFlags = flags.filter((flag) => !jsonFlags.has(flag));

    if (unknownFlags.length > 0) {
        console.error(`[Error] Unknown: ${unknownFlags.join(", ")}. validate supports only --json.`);
        process.exit(1);
    }

    return {
        json: flags.includes("--json"),
    };
}

function toValidationError(skill, message) {
    return {
        tool: "skill-repo",
        path: skill.fileName,
        error: message,
    };
}

function runValidate(flags, context) {
    const { json } = parseValidateFlags(flags);
    const { skills } = readCache(context.cwd, { update: false });
    const errors = [];
    const seenNames = new Set();

    for (const skill of skills) {
        if (!skill.metadata || typeof skill.metadata.description !== "string" || !skill.metadata.description.trim()) {
            errors.push(toValidationError(skill, "Missing required frontmatter key: description"));
        }

        if (
            skill.metadata
            && Object.prototype.hasOwnProperty.call(skill.metadata, "alwaysApply")
            && typeof skill.metadata.alwaysApply !== "boolean"
        ) {
            errors.push(toValidationError(skill, "alwaysApply must be boolean (true/false)"));
        }

        if (
            skill.metadata
            && Object.prototype.hasOwnProperty.call(skill.metadata, "globs")
            && typeof skill.metadata.globs !== "string"
        ) {
            errors.push(toValidationError(skill, "globs must be a string"));
        }

        const normalizedName = (skill.name || "").trim().toLowerCase();
        if (!normalizedName) {
            errors.push(toValidationError(skill, "Skill name is empty"));
        } else if (seenNames.has(normalizedName)) {
            errors.push(toValidationError(skill, `Duplicate skill name detected: ${skill.name}`));
        } else {
            seenNames.add(normalizedName);
        }
    }

    if (json) {
        const payload = {
            valid: errors.length === 0,
            skillCount: skills.length,
            errors,
        };
        console.log(JSON.stringify(payload, null, 2));
        if (!payload.valid) {
            process.exit(1);
        }
        return;
    }

    if (errors.length > 0) {
        console.error("[Validate] Failed");
        errors.forEach((item) => console.error(`  - [${item.path}] ${item.error}`));
        process.exit(1);
    }

    console.log(`[Validate] OK (${skills.length} skills)`);
}

module.exports = {
    runValidate,
};
