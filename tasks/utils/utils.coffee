exports.processArgs = (argv) ->
    if argv.length < 5
        console.error('not enough arguments')
        process.exit(1)
    if argv[0] != 'coffee'
        console.error("tasks should be run with 'coffee' explicitely")
        process.exit(1)
    if argv[1] != require.main.filename
        console.error("task filename is not in argv")
        process.exit(1)
    sepIndex = argv.indexOf('--')
    if (sepIndex <= 2)
        console.error('no seperation of deps and targets')
        process.exit(1)
    deps = argv[2..(sepIndex - 1)]
    targets = process.argv[(sepIndex + 1)..]
    return {deps:deps, targets:targets}


exports.reactRender = (jsx, html, output) ->
    fs = require('fs')
    React = require('react')
    ReactDOMServer = require('react-dom/server')
    jsdom = require('jsdom')

    require('babel-register')({presets: ['react']})
    Main = require(process.cwd() + '/' + jsx)

    react = ReactDOMServer.renderToString(React.createElement(Main))

    rawHtml = fs.readFileSync(html, {encoding:'utf8'})
    document = jsdom.jsdom(rawHtml)

    content = document.getElementById('content')
    content.innerHTML = react

    fs.writeFileSync(output, jsdom.serializeDocument(document))
