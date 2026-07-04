// Emit a double-quoted YAML scalar that is safe against quotes, backslashes,
// and newlines. JSON string syntax is a valid subset of YAML double-quoted
// scalars, so JSON.stringify gives correct escaping for frontmatter values.
function yamlQuote(value) {
    return JSON.stringify(value == null ? "" : String(value));
}

module.exports = {
    yamlQuote,
};
