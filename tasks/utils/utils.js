const fs = require('fs')
const globule = require('globule')

const {RouterContext} = require('react-router')

exports.processArgs = function(argv) {
  if (argv.length < 5) {
    console.error('not enough arguments')
    process.exit(1)
  }
  if (!argv[0].endsWith('node')) {
    console.error("tasks should be run with 'node' explicitely")
    process.exit(1)
  }
  if (argv[1] !== require.main.filename) {
    console.error('task filename is not in task arguments')
    process.exit(1)
  }
  const sepIndex = argv.indexOf('--')
  const deps = argv.slice(2, sepIndex - 1 + 1 || undefined)
  const config = process.argv[sepIndex + 1]
  const cached_build = process.argv[sepIndex + 2] === 'true'
  const targets = process.argv.slice(sepIndex + 3)
  return {config, cached_build, deps, targets}
}

exports.reactRender = function(jsx, html, output, router = false) {
  const fs = require('fs')
  const React = require('react')
  const ReactDOMServer = require('react-dom/server')
  const {Helmet} = require('react-helmet')
  const jsdom = require('jsdom')

  require('@babel/register')({presets: ['@babel/react', '@babel/env']})
  const Main = require(process.cwd() + '/' + jsx)

  if (router) {
    var react = ReactDOMServer.renderToString(
      React.createElement(RouterContext, {}, [React.createElement(Main)])
    )
  } else {
    var react = ReactDOMServer.renderToString(React.createElement(Main))
  }

  const rawHtml = fs.readFileSync(html, {encoding: 'utf8'})
  const document = jsdom.jsdom(rawHtml)

  const helmet = Helmet.renderStatic()

  const {head} = jsdom.jsdom(`<head>
       ${helmet.title.toString()}
       ${helmet.meta.toString()}
       ${helmet.link.toString()}
    </head>`)

  // replace title only if helmet one isn't empty
  for (const tag of head.children) {
    if (tag.tagName === 'TITLE') {
      if (tag.innerHTML) {
        for (const documentTag of document.head.children) {
          if (documentTag.tagName === 'TITLE') {
            document.head.removeChild(documentTag)
          }
        }
      } else {
        head.removeChild(tag)
      }
    }
  }

  document.head.innerHTML += head.innerHTML

  const content = document.getElementById('content')
  content.innerHTML = react

  return fs.writeFileSync(output, jsdom.serializeDocument(document))
}

exports.findBoardFile = function(path, ext, check) {
  let f = globule.find(`${path}/**/*.` + ext)[0]
  if ((check == null) || (f != null && check(f))) {
    return f
  }
  return null
}

exports.checkEagleFile = function(f) {
  return fs.readFileSync(f, 'utf8').includes('eagle.dtd')
}
