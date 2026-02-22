const { LATEST_VERSION_COMMAND } = require("@/commands/constants");

function runHelp(flags, context) {
    if (flags.length > 0) {
        console.error(`[Error] Unknown: ${flags.join(", ")}. help takes no arguments.`);
        process.exit(1);
    }

    const toolLines = Object.entries(context.tools)
        .map(([key, tool]) => `  ${key.padEnd(14)} ${tool.output}`)
        .join("\n");

    console.log(`
Usage:
  heymark link <repo-url>
  heymark sync .
  heymark sync <tool1> <tool2> ...
  heymark clean .
  heymark clean <tool1> <tool2> ...

Link flags:
    --branch | -b
    --folder | -f

Supported tools:
${toolLines}

Update:  ${LATEST_VERSION_COMMAND}
`);
}

module.exports = {
    runHelp,
};
