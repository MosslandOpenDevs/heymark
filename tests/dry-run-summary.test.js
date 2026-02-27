const fs = require("fs");
const os = require("os");
const path = require("path");
const test = require("node:test");
const assert = require("node:assert/strict");

require("../src/alias");

const { preview } = require("@/tools/skill-per-file");
const { buildDryRunSummary, printDryRunSummary } = require("@/commands/sync/dry-run-summary");

function withCapturedLogs(fn) {
    const originalLog = console.log;
    const lines = [];
    console.log = (...args) => lines.push(args.join(" "));
    try {
        fn();
    } finally {
        console.log = originalLog;
    }
    return lines.join("\n");
}

test("dry-run summary reports created/updated/deleted files with totals", () => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "heymark-dryrun-"));
    const dir = path.join(".cursor", "rules");
    const targetDir = path.join(cwd, dir);
    fs.mkdirSync(targetDir, { recursive: true });

    fs.writeFileSync(path.join(targetDir, "alpha.mdc"), "old-alpha\n", "utf8");
    fs.writeFileSync(path.join(targetDir, "legacy.mdc"), "legacy\n", "utf8");

    const skills = [
        { name: "alpha", body: "Alpha body" },
        { name: "beta", body: "Beta body" },
    ];

    const diff = preview({
        cwd,
        dir,
        skills,
        fileSuffix: ".mdc",
        getFileName(skill) {
            return `${skill.name}.mdc`;
        },
        createContent(skill) {
            return `${skill.body}\n`;
        },
    });

    assert.deepEqual(diff.created, [path.join(".cursor", "rules", "beta.mdc")]);
    assert.deepEqual(diff.updated, [path.join(".cursor", "rules", "alpha.mdc")]);
    assert.deepEqual(diff.deleted, [path.join(".cursor", "rules", "legacy.mdc")]);

    const summary = buildDryRunSummary(
        {
            cursor: {
                name: "Cursor",
                preview() {
                    return diff;
                },
            },
        },
        ["cursor"],
        skills,
        cwd
    );

    assert.equal(summary.totals.created, 1);
    assert.equal(summary.totals.updated, 1);
    assert.equal(summary.totals.deleted, 1);

    const output = withCapturedLogs(() => printDryRunSummary(summary));
    assert.match(output, /\[Dry-run Summary\]/);
    assert.match(output, /\+ \.cursor\/rules\/beta\.mdc/);
    assert.match(output, /~ \.cursor\/rules\/alpha\.mdc/);
    assert.match(output, /- \.cursor\/rules\/legacy\.mdc/);
    assert.match(output, /TOTAL\s+create:\s*1 update:\s*1 delete:\s*1/);
});
