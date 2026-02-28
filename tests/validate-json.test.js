const fs = require("fs");
const os = require("os");
const path = require("path");
const test = require("node:test");
const assert = require("node:assert/strict");
const { spawnSync } = require("child_process");

const CLI_PATH = path.resolve(__dirname, "../src/index.js");

function createLinkedCacheWorkspace(skillContent) {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "heymark-validate-json-"));

    const repoUrl = "https://example.com/demo-skills.git";
    const cacheDir = path.join(cwd, ".heymark", "cache", "demo-skills");

    fs.mkdirSync(cacheDir, { recursive: true });
    fs.writeFileSync(
        path.join(cwd, ".heymark", "config.json"),
        JSON.stringify({ repoUrl, branch: "main" }, null, 2),
        "utf8"
    );
    fs.writeFileSync(path.join(cacheDir, "skill.md"), skillContent, "utf8");

    return cwd;
}

function runValidateJson(cwd) {
    const result = spawnSync(process.execPath, [CLI_PATH, "validate", "--json"], {
        cwd,
        encoding: "utf8",
    });

    let parsed;
    try {
        parsed = JSON.parse(result.stdout || "{}");
    } catch {
        parsed = null;
    }

    return {
        code: result.status,
        stdout: result.stdout,
        stderr: result.stderr,
        json: parsed,
    };
}

test("validate --json returns structured errors and exit code 1 when invalid", () => {
    const cwd = createLinkedCacheWorkspace("# Missing frontmatter description\n\nBody");
    const result = runValidateJson(cwd);

    assert.equal(result.code, 1);
    assert.ok(result.json, "stdout should be valid JSON");
    assert.equal(result.json.valid, false);
    assert.equal(result.json.skillCount, 1);
    assert.ok(Array.isArray(result.json.errors));
    assert.ok(result.json.errors.length > 0);

    const firstError = result.json.errors[0];
    assert.equal(firstError.tool, "skill-repo");
    assert.equal(firstError.path, "skill.md");
    assert.match(firstError.error, /description/i);
});

test("validate --json returns valid=true and exit code 0 when valid", () => {
    const cwd = createLinkedCacheWorkspace(
        [
            "---",
            'description: "A valid skill"',
            'globs: "**/*.ts"',
            "alwaysApply: true",
            "---",
            "",
            "# Skill",
            "",
            "Body",
        ].join("\n")
    );

    const result = runValidateJson(cwd);

    assert.equal(result.code, 0);
    assert.ok(result.json, "stdout should be valid JSON");
    assert.equal(result.json.valid, true);
    assert.equal(result.json.skillCount, 1);
    assert.deepEqual(result.json.errors, []);
});
