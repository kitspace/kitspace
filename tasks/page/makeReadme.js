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
    const folders = folder.split('/')
    const pattern = `${folder}/readme?(\.markdown|\.mdown|\.mkdn|\.md|\.rst)`
    const readmes = glob.sync(pattern, {nocase: true})
    const deps = [`build/.temp/${folder}/info.json`]
    if (readmes.length > 0) {
      deps.push(readmes[0])
    }

    const targets = [`build/.temp/${folder}/readme.jsx`]

    if (folders.length > 4) {
      const projectPath = folders.splice(4).join('/')
      targets.push(projectPath)
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
    const pkg = {repository: {url: info.repo}}
    let contents = fs.readFileSync(readme, 'utf8')
    let markdown = ''

    if (path.extname(readme).toLowerCase() === '.rst') {
      markdown = rst2mdown(contents)
    } else {
      markdown = contents
    }

    if (info.repo.includes('github')) {
      markdown = replaceImageUrls(markdown)
      markdown = addSpacing(markdown)
      if (multiProjectPath) {
        markdown = correctMarkdownImagePaths(markdown, multiProjectPath)
      }
    }

    html = marky(markdown, {package: pkg}).html()
  }
  const reactComponent = converter.convert(`<div class='readme'>${html}</div>`)
  fs.writeFileSync(
    readmeJsx,
    `const React = require('react');\n${reactComponent}\nmodule.exports = Readme;\n`
  )
}

function addSpacing(string) {
  return string.replace(/[^ `](`[^\`].*?`)/g, ' $1')
}

// replace blob image urls with raw image urls, they don't work outside of github
function replaceImageUrls(string) {
  const imageUrl = /(https:\/\/github\.com\/.*?\/)(blob)(\/master\/.*?.(:?png|jpeg|jpg|gif|bmp))/gi

  return string.replace(imageUrl, '$1raw$3')
}

function correctMarkdownImagePaths(string, projectPath) {
  const imagePath = /(!\[.*?]\()((?!https:\/\/).+?(\.png|\.jpg|\.gif|\.jpeg|\.bmp))/gi

  return string.replace(imagePath, (_match, _$1, path) => {
    const parts = path.split('/')
    const fileName = parts[parts.length - 1]

    return `(/${projectPath}/${fileName}`
  })
}
