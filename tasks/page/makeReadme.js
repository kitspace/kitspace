const fs = require('fs')
const utils = require('../utils/utils')
const glob = require('glob')
const marky = require('@kitspace/marky-markdown')
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
      const pattern = `${boardInfo.boardPath}/readme?(\.markdown|\.mdown|\.mkdn|\.md|\.rst)`
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
    const pkg = {repository: {url: info.repo}}
    let contents = fs.readFileSync(readme, 'utf8')
    let markdown = ''

    if (path.extname(readme).toLowerCase() === '.rst') {
      markdown = rst2mdown(contents)
    } else {
      markdown = contents
    }

    if (info.repo.includes('https://github.com')) {
      markdown = addSpacing(markdown)
      markdown = correctMarkdownImagePaths(markdown, multiProjectPath)
    }
    html = marky(markdown, {package: pkg})
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

// Replace blob file urls with raw file urls, they don't work outside of github
function replaceBlobUrls(string) {
  const blobUrl = /(https:\/\/github\.com\/.*?\/)(blob)(\/.*?\.)/gi

  return string.replace(blobUrl, '$1raw$3')
}

// Add project path from root folder to images; required before being parsed by marky markdown
function addProjectPath(imgTag, markdownPath, projectPath) {
  let imgUrl
  if (path.isAbsolute(markdownPath)) {
    imgUrl = markdownPath
  } else {
    imgUrl = path.join('/' + projectPath, markdownPath)
  }
  return imgTag + imgUrl
}

function correctMarkdownImagePaths(string, projectPath) {
  const imagePath = /(!\[.*?]\()(.+?(\.png|\.jpg|\.gif|\.jpeg|\.bmp))/gi

  return string.replace(imagePath, (match, imgTag, path) => {
    if (match.includes('/blob/')) {
      return replaceBlobUrls(match)
    }

    if (projectPath) {
      return addProjectPath(imgTag, path, projectPath)
    }
    return match
  })
}
