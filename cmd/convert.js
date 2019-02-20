const fs = require('fs');
const fountainparse = require('./fountainparse');

// Error messages
const ERROR_INPUT_DOES_NOT_EXIST = 'ERROR: Input file not found';
const ERROR_OUTPUT_FILE_EXISTS = 'ERROR: Output file already exists';
const ERROR_INPUT_FILE_READ_ERROR = 'ERROR: Failed to read input file';

function validateArguments(input, output) {
    let result = true;

    if (!fs.existsSync(input)) {
        result = false;
        console.log(ERROR_INPUT_DOES_NOT_EXIST);
    }

    if (fs.existsSync(output)) {
        result = false;
        console.log(ERROR_OUTPUT_FILE_EXISTS);
    }

    return result;
}

function parseScriptFile(path) {
    let input, output;

    try {
        input = fs.readFileSync(path, 'utf8');
        output = fountainparse(input);
    } catch {
        console.log(ERROR_INPUT_FILE_READ_ERROR);
    }

    return output;
}

module.exports = (args) => {
    if (validateArguments(args.i, args.o)) {
        let scriptObject = parseScriptFile(args.i);
        console.log(scriptObject);
    }
}