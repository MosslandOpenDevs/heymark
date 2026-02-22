const fs = require("fs");
const path = require("path");
const Module = require("module");

const PREFIX = "@/";
const REGISTERED_KEY = "__heymark_alias_registered__";
const ROOT = __dirname;

function getPath(request) {
    if (!request.startsWith(PREFIX)) {
        return null;
    }

    const rest = request.slice(PREFIX.length);
    const base = path.join(ROOT, rest);
    const candidates = [`${base}.js`, path.join(base, "index.js"), base];

    const found = candidates.find((c) => fs.existsSync(c));
    return found || base;
}

function registerPath() {
    const g = /** @type {Record<string, unknown>} */ (globalThis);
    if (g[REGISTERED_KEY] === true) {
        return;
    }

    const original = Module._resolveFilename;

    Module._resolveFilename = function (request, parent, isMain, options) {
        const resolved = typeof request === "string" ? getPath(request) : null;
        if (resolved) {
            return original.call(this, resolved, parent, isMain, options);
        }
        return original.call(this, request, parent, isMain, options);
    };

    g[REGISTERED_KEY] = true;
}

registerPath();
