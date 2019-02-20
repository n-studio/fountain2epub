const fs = require('fs');

// Error messages
const ERROR_INPUT_DOES_NOT_EXIST = 'ERROR: Input file not found';
const ERROR_OUTPUT_FILE_EXISTS = 'ERROR: Output file already exists';
const ERROR_INPUT_FILE_NOT_VALID = 'ERROR: Input file is not a valid Fountain script';

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

module.exports = (args) => {
    //console.log(args);
    if (validateArguments(args.i, args.o)) {
        console.log('arguments validated!');
    }
}