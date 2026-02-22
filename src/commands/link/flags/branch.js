const key = "branch";
const FLAG = "--branch";
const SHORT_FLAG = "-b";

function is(flag) {
    return flag === FLAG || flag === SHORT_FLAG;
}

function parse(flags, index) {
    const value = flags[index + 1];
    if (!value) {
        console.error("[Error] --branch needs a value.");
        process.exit(1);
    }
    return { value: value.trim(), advance: 1 };
}

module.exports = { key, is, parse };
