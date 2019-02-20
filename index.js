const minimist = require('minimist');

module.exports = () => {
    const args = minimist(process.argv.slice(2));

    let cmd = args._[0] || 'help';

    if (args.version || args.v) {
        cmd = 'version';
    }

    if (args.i && args.o) {
        cmd = 'convert';
    }

    switch(cmd) {
        case 'version': require('./cmd/version')(args); break;
        case 'help': require('./cmd/help')(args); break;
        case 'convert': require('./cmd/convert')(args); break;
        default: console.log(`Argument "${cmd}" not recognized. Try fountain2epub -h for more information.`); break;
    }
}