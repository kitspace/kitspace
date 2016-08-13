exports.processArgs = (argv) ->
    if argv.length < 5
        console.error('not enough arguments')
        process.exit(1)
    if argv[0] != 'coffee'
        console.error("tasks should be run with 'coffee' explicitely")
        process.exit(1)
    if argv[1] != require.main.filename
        console.error('task filename is not in task arguments')
        process.exit(1)
    sepIndex = argv.indexOf('--')
    deps = argv[2..(sepIndex - 1)]
    config = process.argv[(sepIndex + 1)]
    targets = process.argv[(sepIndex + 2)..]
    return {config, deps, targets}


exports.reactRender = (jsx, html, output) ->
    fs = require('fs')
    React = require('react')
    ReactDOMServer = require('react-dom/server')
    DocumentTitle = require('react-document-title')
    jsdom = require('jsdom')

    require('babel-register')({presets: ['react']})
    Main = require(process.cwd() + '/' + jsx)

    react = ReactDOMServer.renderToString(React.createElement(Main))

    title = DocumentTitle.rewind(react)

    rawHtml = fs.readFileSync(html, {encoding:'utf8'})
    document = jsdom.jsdom(rawHtml)

    if title?
        for t in document.head.getElementsByTagName('title')
            document.head.removeChild(t)
        tag = document.createElement('title')
        tag.innerHTML = title
        document.head.appendChild(tag)

    content = document.getElementById('content')
    content.innerHTML = react

    fs.writeFileSync(output, jsdom.serializeDocument(document))
