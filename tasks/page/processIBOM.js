const fs = require('fs')
const path = require('path')
const utils = require('../utils/utils')
const cp = require('child_process')

const omitIBOMFile = 'omit-ibom-boards.txt'

const omitIBOMBoards =
  fs.readFileSync(omitIBOMFile, 'utf-8').split('\n').filter(Boolean)

if (require.main !== module) {
  module.exports = function(config, boardInfo) {
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
    if (pcbFile === undefined) {
      pcbFile = utils.findBoardFile(boardInfo.boardPath, 'brd', utils.checkEagleFile)
    }
    const omit = omitIBOMBoards.includes(boardInfo.boardPath.split('/').slice(1).join('/'))
    if (pcbFile === undefined || omit) {
      return {deps: [], targets: [], moduleDep: false};
    }
    const deps = [
      pcbFile,
      `build/.temp/${boardInfo.boardPath}/info.json`,
      omitIBOMFile
    ]
    const buildFolder = boardInfo.boardPath.replace('boards', 'build/boards')
    const targets = [
      `${buildFolder}/interactive_bom.json`
    ]
    return {deps, targets, moduleDep: false}
  }
} else {
  const {config, deps, targets} = utils.processArgs(process.argv)
  let pcbFile = deps[0];
  let infoFile = deps[1];
  let ibom = targets[0];
  const run_ibom = path.join(__dirname, 'run_ibom')
  cp.execSync(`${run_ibom} "${pcbFile}" "${infoFile}" "${ibom}"`)
}
