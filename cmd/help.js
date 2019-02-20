const message = `
fountain2epub [command] <options>

    version ............................ display the software version
    i .................................. specify input file (Fountain)
    o .................................. specify output file (EPUB)

Example:

    fountain2epub -i myscript.fountain -o myscript.epub

To perform a conversion, both an input, and an output file must be specified
with the -i, and -o commands, respectively. The input file must be a valid
Fountain script, and the output path cannot point to an existing file.
`

module.exports = (args) => {
    console.log(message);
}