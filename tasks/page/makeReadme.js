const fs = require('fs')
const utils = require('../utils/utils')
const glob = require('glob')
const marky = require('marky-markdown')
const path = require('path')
const htmlToJsx = require('htmltojsx')
const rst2mdown = require('rst2mdown')

const converter = new htmlToJsx({createClass: true, outputClassName: 'Readme'})

if (require.main !== module) {
  module.exports = function(config, folder) {
    const pattern = `${folder}/readme?(\.markdown|\.mdown|\.mkdn|\.md|\.rst)`
    const readmes = glob.sync(pattern, {nocase: true})
    const deps = [`build/.temp/${folder}/info.json`]
    if (readmes.length > 0) {
      deps.push(readmes[0])
    }
    const targets = [`build/.temp/${folder}/readme.jsx`]
    return {deps, targets, moduleDep: false}
  }
} else {
  const {deps, targets} = utils.processArgs(process.argv)
  const readmeJsx = targets[0]
  let html = ''
  const info = require(__dirname + '/../../' + deps[0])
  const readme = deps[1]
  if (readme != null) {
    const pkg = {repository: {url: info.repo}}
    let contents = fs.readFileSync(readme, 'utf8')
    // replace blob image urls with raw image urls, they don't work outside of github
    contents = contents.replace(
      RegExp(
        '(' +
          escapeRegExp('https://github.com/') +
          '.*?' +
          '/)(blob)(/master/' +
          '.*?.(:?png|jpeg|jpg|gif|bmp))',
        'gi'
      ),
      '$1raw$3'
    )
    let markdown = addSpacing(contents)
    if (path.extname(readme).toLowerCase() === '.rst') {
      markdown = rst2mdown(contents)
    }
    html = marky(markdown, {package: pkg}).html()
  }
  const reactComponent = converter.convert(`<div class='readme'>${html}</div>`)
  fs.writeFileSync(
    readmeJsx,
    `const React = require('react');\n${reactComponent}\nmodule.exports = Readme;\n`
  )
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

function addSpacing(string) {
  return string.replace(/[^ `](`[^\`].*?`)/g, ' $1')
}
