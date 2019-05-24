const fs = require('fs')
const globule = require('globule')
const path = require('path')
const yaml = require('js-yaml')
const oneClickBOM = require('1-click-bom')
const cp = require('child_process')

const utils = require('../utils/utils')
const getPartinfo = require('../../src/get_partinfo.js')

if (require.main !== module) {
  module.exports = function(config, folder) {
    let bom, file, info, repoRootPath, projectPath
    const repoFolders = folder.split('/')

    if (repoFolders.length > 4) {
      repoRootPath = repoFolders.slice(0, 4).join('/')
      projectPath = repoFolders.splice(4).join('/')
    } else {
      repoRootPath = folder
      projectPath = folder
    }

    if (fs.existsSync(`${repoRootPath}/kitnic.yaml`)) {
      file = fs.readFileSync(`${repoRootPath}/kitnic.yaml`)
    } else if (fs.existsSync(`${repoRootPath}/kitspace.yaml`)) {
      file = fs.readFileSync(`${repoRootPath}/kitspace.yaml`)
    } else if (fs.existsSync(`${repoRootPath}/kitspace.yml`)) {
      file = fs.readFileSync(`${repoRootPath}/kitspace.yml`)
    }
    if (file != null) {
      info = yaml.safeLoad(file)
    } else {
      info = {}
    }

    if (info.multi) {
      for (let project in info.multi) {
        if (project === projectPath) {
          info = info.multi[project]
        }
      }
    }

    if (info.bom) {
      bom = path.join(repoRootPath, info.bom)
    } else {
      bom = path.join(projectPath, '1-click-bom.tsv')
    }

    const deps = ['build/.temp/boards.json', folder, bom]
    const targets = [
      `build/.temp/${folder}/info.json`,
      `build/${folder}/1-click-BOM.tsv`
    ]
    return {deps, targets, moduleDep: false}
  }
} else {
  let file, kitnicYaml, repoRootPath
  const {deps, targets} = utils.processArgs(process.argv)
  const [boardsJSON, folder, bomPath] = deps
  const [infoPath, outBomPath] = targets

  const boards = JSON.parse(fs.readFileSync(boardsJSON))
  const info = {id: folder.replace('boards/', '')}

  info.summary = boards.reduce((prev, obj) => {
    if (obj.id === info.id) {
      return obj.summary
    } else {
      return prev
    }
  }, '')

  repoFolders = folder.split('/')
  if (repoFolders.length > 4) {
    repoRootPath = repoFolders.slice(0, 4).join('/')
  } else {
    repoRootPath = folder
  }

  if (fs.existsSync(`${repoRootPath}/kitnic.yaml`)) {
    file = fs.readFileSync(`${repoRootPath}/kitnic.yaml`)
  } else if (fs.existsSync(`${repoRootPath}/kitspace.yaml`)) {
    file = fs.readFileSync(`${repoRootPath}/kitspace.yaml`)
  } else if (fs.existsSync(`${repoRootPath}/kitspace.yml`)) {
    file = fs.readFileSync(`${repoRootPath}/kitspace.yml`)
  }
  if (file != null) {
    kitnicYaml = yaml.safeLoad(file)
  } else {
    kitnicYaml = {}
  }
  info.site = kitnicYaml.site || ''

  if (/\.tsv$|\.csv$/i.test(bomPath)) {
    var content = fs.readFileSync(bomPath, {encoding: 'utf8'})
  } else {
    var content = fs.readFileSync(bomPath)
  }
  info.bom = oneClickBOM.parse(content)
  info.bom.invalid.forEach(invalid => {
    console.log('INVALID LINE:', invalid)
  })
  info.bom.warnings.forEach(warning => {
    console.log('WARNING:', warning)
  })
  if (!info.bom.lines || info.bom.lines.length === 0) {
    console.error('ERROR: No lines in BOM found')
    process.exit(1)
  }
  info.bom.tsv = oneClickBOM.writeTSV(info.bom.lines)

  let repo = cp.execSync(`cd ${folder} && git remote -v`, {encoding: 'utf8'})
  repo = repo.split('\t')[1].split(' ')[0]
  info.repo = repo

  getPartinfo(info.bom.lines).then(parts => {
    info.bom.parts = parts

    fs.writeFile(infoPath, JSON.stringify(info))

    fs.writeFile(outBomPath, info.bom.tsv)
  })
}
