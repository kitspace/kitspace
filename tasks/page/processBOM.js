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
    let bom, file, info
    if (fs.existsSync(`${folder}/kitnic.yaml`)) {
      file = fs.readFileSync(`${folder}/kitnic.yaml`)
    } else if (fs.existsSync(`${folder}/kitspace.yaml`)) {
      file = fs.readFileSync(`${folder}/kitspace.yaml`)
    }
    if (file != null) {
      info = yaml.safeLoad(file)
    } else {
      info = {}
    }
    if (info.bom) {
      bom = folder + '/' + info.bom
    } else {
      bom = folder + '/1-click-bom.tsv'
    }
    const deps = ['build/.temp/boards.json', folder, bom]
    const targets = [
      `build/.temp/${folder}/info.json`,
      `build/${folder}/1-click-BOM.tsv`
    ]
    return {deps, targets, moduleDep: false}
  }
} else {
  let file, kitnicYaml
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

  try {
    file = fs.readFileSync(`${folder}/kitnic.yaml`)
  } catch (error) {}

  if (file != null) {
    kitnicYaml = yaml.safeLoad(file)
  }
  info.site = kitnicYaml && kitnicYaml.site ? kitnicYaml.site : ''

  const tsv = fs.readFileSync(bomPath, {encoding: 'utf8'})
  info.bom = oneClickBOM.parseTSV(tsv)

  if (!info.bom.lines || info.bom.lines.length === 0) {
    console.error('No lines in BOM found')
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
