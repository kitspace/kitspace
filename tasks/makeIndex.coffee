fs      = require('fs')
path    = require('path')
globule = require('globule')
utils   = require('./utils/utils')
cp      = require('child_process')

if require.main != module

    exports.deps = ['build/.temp/Main.jsx', 'src/index.html']
    exports.targets = ['build/index.html']

else

    {deps, targets} = utils.processArgs(process.argv)

    React = require('react')
    ReactDOMServer = require('react-dom/server')
    jsdom = require('jsdom')

    require('babel-register')({presets: ['react']})
    Main = require('../' + deps[0])

    react = ReactDOMServer.renderToString(React.createElement(Main))

    rawHtml = fs.readFileSync(deps[1], {encoding:'utf8'})
    document = jsdom.jsdom(rawHtml)

    content = document.getElementById('content')
    content.innerHTML = react

    fs.writeFileSync(targets[0], jsdom.serializeDocument(document))
