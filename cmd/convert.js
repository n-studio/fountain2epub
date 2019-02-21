const fs = require('fs');
const dateformat = require('dateformat');
const fountainparse = require('./fountainparse');
const epubwriter = require('./epubwriter');

// Error messages
const ERROR_INPUT_DOES_NOT_EXIST = 'ERROR: Input file not found';
const ERROR_OUTPUT_FILE_EXISTS = 'ERROR: Output file already exists';
const ERROR_INPUT_FILE_READ_ERROR = 'ERROR: Failed to read input file';

// HTML Templating
// TODO: Change to a proper templating solution
const HTML_DOCTYPE_TAG = '<!DOCTYPE html>';
const HTML_TAG_OPEN = '<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">';
const HTML_TAG_CLOSE = '</html>';
const HTML_HEAD_ELEMENT = '<head><meta charset="utf-8"/><title></title><link rel="stylesheet" type="text/css" href="screenplay.css"/></head>';
const HTML_BODY_TAG_OPEN = '<body>';
const HTML_BODY_TAG_CLOSE = '</body>';
const NAV_DOCUMENT_CONTENTS = '<nav epub:type="toc" id="toc"><h1 class="title">Table of Contents</h1><ol><li id="ttl"><a href="titlepage.xhtml">Title Page</a></li><li id="script"><a href="script.xhtml">Script</a></li><li id="nav"><a href="nav.xhtml">Table of Contents</a></li></ol></nav><nav epub:type="landmarks" hidden=""><h2>Guide</h2><ol><li><a epub:type="toc" href="#toc">Table of Contents</a></li><li><a epub:type="cover" href="titlepage.xhtml">Title Page</a></li><li><a epub:type="bodymatter" href="script.xhtml">Script</a></li></ol></nav>'

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

function generateContents(scriptObject) {
    let contents = [];

    let css = fs.readFileSync('../res/screenplay.css', 'utf8');

    contents.push({
        'id': 'titlepage',
        'type': 'xhtml',
        'contentsInline': true,
        'fileContents': buildHtmlFile(scriptObject.html.title_page)
    });

    contents.push({
        'id': 'script',
        'type': 'xhtml',
        'contentsInline': true,
        'fileContents': buildHtmlFile(scriptObject.html.script)
    });

    contents.push({
        'id': 'nav',
        'type': 'xhtml',
        'contentsInline': true,
        'fileContents': buildHtmlFile(NAV_DOCUMENT_CONTENTS),
        'properties': 'nav'
    });

    contents.push({
        'id': 'screenplay',
        'type': 'css',
        'contentsInline': false,
        'path': '../res/screenplay.css'
    });

    contents.push({
        'id': 'texgyrecursor-regular',
        'type': 'otf',
        'contentsInline': false,
        'path': '../res/texgyrecursor-regular.otf'
    });

    contents.push({
        'id': 'texgyrecursor-bold',
        'type': 'otf',
        'contentsInline': false,
        'path': '../res/texgyrecursor-bold.otf'
    });

    contents.push({
        'id': 'texgyrecursor-italic',
        'type': 'otf',
        'contentsInline': false,
        'path': '../res/texgyrecursor-italic.otf'
    });

    contents.push({
        'id': 'texgyrecursor-bolditalic',
        'type': 'otf',
        'contentsInline': false,
        'path': '../res/texgyrecursor-bolditalic.otf'
    });

    return contents;
}

function getMetadata(scriptObject) {
    // Defaults to setting the time of conversion for the last modified
    // timestamp in the EPUB document's metadata
    let lastModified = new Date();
    let creator;

    if (scriptObject.author !== undefined && scriptObject.authors !== undefined) {
        creator = scriptObject.author + ' ' + scriptObject.authors;
    } else if (scriptObject.author !== undefined) {
        creator = scriptObject.author;
    } else if (scriptObject.authors !== undefined) {
        creator = scriptObject.authors;
    }

    return {
        'title': scriptObject.title,
        'creator': creator,
        'modified': dateformat(lastModified, 'isoDateTime').split('+')[0] + 'Z', // TODO: figure out how to pass EPUBCheck without faking UTC
        'rights': scriptObject.rights
    }
}

function buildHtmlFile(contents) {
    return HTML_DOCTYPE_TAG + HTML_TAG_OPEN + HTML_HEAD_ELEMENT + HTML_BODY_TAG_OPEN + contents + HTML_BODY_TAG_CLOSE + HTML_TAG_CLOSE;
}

module.exports = (args) => {
    if (validateArguments(args.i, args.o)) {
        let scriptObject = parseScriptFile(args.i);
        let contents = generateContents(scriptObject);
        let metadata = getMetadata(scriptObject);

        epubwriter(args.o, contents, metadata);
    }
}