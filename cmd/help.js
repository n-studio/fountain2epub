const message = `
fountain2epub [command] <options>

    version ............................ display the software version
    i .................................. specify input file (Fountain)
    o .................................. specify output file (EPUB)

Example:

    fountain2epub -i myscript.fountain -o myscript.epub
`

module.exports = (args) => {
    console.log(message);
}