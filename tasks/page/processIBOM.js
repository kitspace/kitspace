const fs = require('fs')
const globule = require('globule')
const path = require('path')
const utils = require('../utils/utils')
const cp = require('child_process')

if (require.main !== module) {
  module.exports = function(config, boardInfo) {
    let kicadPcbFile
    if (
      boardInfo.eda &&
      boardInfo.eda.type === 'kicad' &&
      boardInfo.eda.pcb != null
    ) {
      kicadPcbFile = path.join(boardInfo.repoPath, boardInfo.eda.pcb)
    } else if (boardInfo.eda == null) {
      const kicadPcbPattern = path.join(boardInfo.boardPath, '**/*.kicad_pcb')
      kicadPcbFile = globule.find(kicadPcbPattern)[0]
    }
    if (kicadPcbFile == null) {
      return {deps: [], targets: [], moduleDep: false};
    }
    const deps = [kicadPcbFile]
    const buildFolder = boardInfo.boardPath.replace('boards', 'build/boards')
    const targets = [
      `${buildFolder}/interactive_bom.json`
    ]
    return {deps, targets, moduleDep: false}
  }
} else {
  const {config, deps, targets} = utils.processArgs(process.argv)
  console.log('-- deps -------');
  console.log(deps)
  console.log('-- targets ----');
  console.log(targets)
  console.log('---------------');
  let kicadPcbFile = deps[0];
  let ibom = targets[0];
  const run_ibom = path.join(__dirname, 'run_ibom')
  cp.execSync(`${run_ibom} "${kicadPcbFile}" "${ibom}"`)
}
