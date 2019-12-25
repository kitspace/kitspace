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
    const fileSystemPathToProject = folder.split('/')
    const pattern = `${folder}/readme?(\.markdown|\.mdown|\.mkdn|\.md|\.rst)`
    const readmes = glob.sync(pattern, {nocase: true})
    const deps = [`build/.temp/${folder}/info.json`]
    if (readmes.length > 0) {
      deps.push(readmes[0])
    }

    const targets = [`build/.temp/${folder}/readme.jsx`]

    // Projects with a folder structure deeper than 4 levels from the system path can be
    // identied as being from a multi project repositoy. The path in relation to the root
    // repository folder is stored for later processing.
    if (fileSystemPathToProject.length > 4) {
      const projectPathFromRepositoryRoot = fileSystemPathToProject
        .splice(4)
        .join('/')
      targets.push(projectPathFromRepositoryRoot)
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
  }
  else {
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
