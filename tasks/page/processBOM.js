const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const oneClickBOM = require('1-click-bom')
const cp = require('child_process')

const utils = require('../utils/utils')
const getPartinfo = require('../../src/get_partinfo.js')

const omitIBOMFile = 'omit-ibom-boards.txt'

const omitIBOMBoards =
  fs.readFileSync(omitIBOMFile, 'utf-8').split('\n').filter(Boolean)

if (require.main !== module) {
  module.exports = function(config, boardInfo) {
    let bom

    if (boardInfo.bom) {
      bom = path.join(boardInfo.repoPath, boardInfo.bom)
    } else {
      bom = path.join(boardInfo.boardPath, '1-click-bom.tsv')
    }
    let pcbFile
    if (
      boardInfo.eda &&
      (boardInfo.eda.type === 'kicad' || boardInfo.eda.type === 'eagle') &&
      boardInfo.eda.pcb != null
    ) {
      pcbFile = path.join(boardInfo.repoPath, boardInfo.eda.pcb)
    } else if (boardInfo.eda == null) {
      pcbFile = utils.findBoardFile(boardInfo.boardPath, 'kicad_pcb')
    }
    if (pcbFile == null) {
      pcbFile = utils.findBoardFile(boardInfo.boardPath, 'brd', utils.checkEagleFile)
    }

    let deps = [
      'build/.temp/boards.json',
      boardInfo.repoPath,
      bom,
      boardInfo.yamlPath,
      omitIBOMFile
    ]
    if (pcbFile != null) {
      deps.push(pcbFile)
    }
    const targets = [
      `build/.temp/${boardInfo.boardPath}/info.json`,
      `build/${boardInfo.boardPath}/1-click-BOM.tsv`
    ]
    return {deps, targets, moduleDep: false}
  }
} else {
  let kitspaceYaml = {}
  const {deps, targets} = utils.processArgs(process.argv)
  const [boardsJSON, repoPath, bomPath, yamlPath] = deps
  const [infoPath, outBomPath] = targets
  const boardFolder = infoPath
    .replace('build/.temp/', '')
    .replace('/info.json', '')

  const boards = JSON.parse(fs.readFileSync(boardsJSON))
  const info = {id: boardFolder.replace('boards/', '')}
  const file = yamlPath ? fs.readFileSync(yamlPath) : null

  info.summary = boards.reduce((prev, obj) => {
    if (obj.id === info.id) {
      return obj.summary
    } else {
      return prev
    }
  }, '')

  if (file != null) {
    kitspaceYaml = yaml.safeLoad(file)
  }

  if (kitspaceYaml.multi) {
    const yamlKey = boardFolder.replace(`${repoPath}/`, '')
    kitspaceYaml = kitspaceYaml.multi[yamlKey]
  }
  info.site = kitspaceYaml.site || ''

  if (/\.tsv$|\.csv$|\.kicad_pcb$/i.test(bomPath)) {
    var content = fs.readFileSync(bomPath, {encoding: 'utf8'})
  } else {
    var content = fs.readFileSync(bomPath)
  }
  info.bom = oneClickBOM.parse(content, {
    ext: /\.kicad_pcb$/i.test(bomPath) ? 'kicad_pcb' : null
  })
  if (info.bom.invalid != null) {
    info.bom.invalid.forEach(invalid => {
      console.log('INVALID LINE:', invalid)
    })
  }
  if (info.bom.warnings != null) {
    info.bom.warnings.forEach(warning => {
      console.log('WARNING:', warning)
    })
  }
  if (!info.bom.lines || info.bom.lines.length === 0) {
    console.error('ERROR: No lines in BOM found')
    process.exit(1)
  }
  info.bom.lines.forEach(line => {
    delete line.retailers['JLC Assembly']
  })
  info.bom.tsv = oneClickBOM.writeTSV(info.bom.lines)

  let repo = cp.execSync(`cd '${repoPath}' && git remote -v`, {
    encoding: 'utf8'
  })
  repo = repo.split('\t')[1].split(' ')[0]
  info.repo = repo

  const repoName = repoPath.split('/').slice(1).join('/')
  const omit = omitIBOMBoards.includes(info.id)
  info.has_interactive_bom =
    !omit && deps.some((d) => d.endsWith('.kicad_pcb') || d.endsWith('.brd'))

  getPartinfo(info.bom.lines).then(parts => {
    info.bom.parts = parts

    fs.writeFile(infoPath, JSON.stringify(info), err => {
      if (err) {
        console.error(err)
        process.exit(1)
      }
    })

    fs.writeFile(outBomPath, info.bom.tsv, err => {
      if (err) {
        console.error(err)
        process.exit(1)
      }
    })
  })
}
