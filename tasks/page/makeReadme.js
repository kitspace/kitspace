const fs = require('fs')
const utils = require('../utils/utils')
const glob = require('glob')
const marky = require('marky-markdown')
const path = require('path')
const htmlToJsx = require('htmltojsx')
const rst2mdown = require('rst2mdown')

const converter = new htmlToJsx({createClass: true, outputClassName: 'Readme'})

if (require.main !== module) {
  module.exports = function(config, boardInfo) {
    const deps = [`build/.temp/${boardInfo.boardPath}/info.json`]
    const targets = [`build/.temp/${boardInfo.boardPath}/readme.jsx`]

    if (boardInfo.readme) {
      deps.push(path.join(boardInfo.repoPath, boardInfo.readme))
    } else {
      const pattern = `${boardInfo.repoPath}/readme?(\.markdown|\.mdown|\.mkdn|\.md|\.rst)`
      const readmes = glob.sync(pattern, {nocase: true})

      if (readmes.length > 0) {
        deps.push(readmes[0])
      }
    }

    // Save path to board directory from the repository root folder.
    if (boardInfo.multiKey) {
      targets.push(boardInfo.multiKey)
    }

    return {deps, targets, moduleDep: false}
  }
} else {
  const {deps, targets} = utils.processArgs(process.argv)
  const readmeJsx = targets[0]
  const multiProjectPath = targets[1]
  let html = ''
  const info = require(__dirname + '/../../' + deps[0])
  const readme = deps[1]
  if (readme != null) {
    const repoUrl = new URL(info.repo)
    const rootPath = path.join('boards', repoUrl.host, repoUrl.pathname)
    const readmeFolder = path.relative(rootPath, path.dirname(readme))
    const pkg = {repository: {url: info.repo, directory: readmeFolder}}
    let contents = fs.readFileSync(readme, 'utf8')
    let markdown = ''

    if (path.extname(readme).toLowerCase() === '.rst') {
      markdown = rst2mdown(contents)
    } else {
      markdown = contents
    }

    const cheerio$ = marky(markdown, {package: pkg})

    // replace any remaining "blob" image sources with their "raw" version so they
    // actually work
    cheerio$('img').each((_, elem) => {
      const img = cheerio$(elem)
      let src = img.attr('src')
      const blobUrl = /^(https:\/\/git(?:hub|lab).com\/.*\/)blob(\/.*)$/
      src = src.replace(blobUrl, '$1raw$2')
      img.attr('src', src)
    })

    html = cheerio$.html()
  }
  let reactComponent = converter.convert(`<div class='readme'>${html}</div>`)

  // And now we have to work around this bug in htmltojsx:
  // https://github.com/reactjs/react-magic/issues/158. The solution
  // adopted here is pretty reprehensible. A more principled approach
  // would be to fix the htmltojsx package, but the PR open to fix
  // this problem is stale, and I don't want to take the time to
  // freshen it up...
  reactComponent = reactComponent.replace(/{"/g, '"').replace(/"}/g, '"')

  fs.writeFileSync(
    readmeJsx,
    `const React = require('react');React.createClass = require('create-react-class');\n${reactComponent}\nmodule.exports = Readme;\n`
  )
}
