const fs = require("fs");
const path = require("path");

const TOOLS_DIR = path.join(__dirname);

function loadTools() {
    const tools = fs
        .readdirSync(TOOLS_DIR)
        .filter((name) => fs.statSync(path.join(TOOLS_DIR, name)).isDirectory())
        .map((name) => require(path.join(TOOLS_DIR, name)));

    return Object.fromEntries(tools.map((tool) => [tool.key, tool]));
}

module.exports = {
    loadTools,
};
