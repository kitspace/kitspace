const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')
const globule = require('globule')
const utils = require('./utils/utils')
const cp = require('child_process')

const boardDir = 'boards'

if (require.main !== module) {
  module.exports = function() {
    const deps = [boardDir]
    const targets = ['build/.temp/boards.json']
    const moduleDep = false
    return {deps, targets, moduleDep}
  }
} else {
  const getBoardInfo = function(project, folder) {
    let board = correctTypes(project)
    let projectFolder = folder

    if (project.path) {
      projectFolder = path.join(projectFolder, project.path)
    }

    board.id = path.relative(boardDir, projectFolder)

    if (board.summary === '' && /^github.com/.test(board.id)) {
      const ghInfo = getGithubInfo(board.id)
      if (__guard__(ghInfo, x => x.description) != null) {
        board.summary = ghInfo.description
      } else {
        console.warn(`WARNING: could not get GitHub description for ${folder}`)
      }
    }

    boards.push(board)
  }

  const getGithubInfo = function(id) {
    let text
    const url = `https://api.github.com/repos${id.replace(/^github.com/, '')}`
    //we use this avoid being rate-limited
    if (process.env.GH_TOKEN != null) {
      text = cp.execSync(`curl -u kasbah:${process.env.GH_TOKEN} ${url}`)
    } else {
      console.warn('Using un-authenticated access to GitHub API')
      text = cp.execSync(`curl ${url}`)
    }
    return JSON.parse(text)
  }

  const correctTypes = function(boardInfo) {
    const boardInfoWithEmpty = {
      id: '',
      summary: ''
    }

    for (let prop in boardInfoWithEmpty) {
      if (boardInfo.hasOwnProperty(prop)) {
        boardInfoWithEmpty[prop] = String(boardInfo[prop])
      }
    }

    return boardInfoWithEmpty
  }

  const {config, deps, targets} = utils.processArgs(process.argv)
  const boards = []
  const folders = globule.find(`${boardDir}/*/*/*`, {filter: 'isDirectory'})
  shuffleArray(folders)

  for (let folder of folders) {
    let info
    let file
    if (fs.existsSync(`${folder}/kitnic.yaml`)) {
      file = fs.readFileSync(`${folder}/kitnic.yaml`)
    } else if (fs.existsSync(`${folder}/kitspace.yaml`)) {
      file = fs.readFileSync(`${folder}/kitspace.yaml`)
    } else if (fs.existsSync(`${folder}/kitspace.yml`)) {
      file = fs.readFileSync(`${folder}/kitspace.yml`)
    }
    if (file != null) {
      info = yaml.safeLoad(file)
    } else {
      info = {}
    }

    if (info.multi) {
      for (let project in info.multi) {
        info.multi[project].path = project

        getBoardInfo(info.multi[project], folder)
      }
    } else {
      getBoardInfo(info, folder)
    }
  }

  const boardJson = fs.openSync(targets[0], 'w')
  fs.write(boardJson, JSON.stringify(boards))
}

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]] // eslint-disable-line no-param-reassign
  }
}
