const fs = require('fs')
const globule = require('globule')
const path = require('path')
const superagent = require('superagent')
const utils = require('../utils/utils')

const apiToken =
  '6f4fe11c9d5e039e6a22fa3bf4f47f5b7bf834db351acc1bb29d6dd7bf46db4f'

if (require.main !== module) {
  module.exports = function(config, boardInfo) {
    const buildFolder = boardInfo.boardPath.replace('boards', 'build/boards')
    const files = globule.find(path.join(boardInfo.boardPath, '**'))
    const kicadPcbPath = findKicadPcbFile(boardInfo.boardPath, files, boardInfo)
    let deps = []
    let targets = []
    if (kicadPcbPath != null) {
      targets = [`${buildFolder}/images/layout.svg`]
      deps = kicadPcbPath ? [kicadPcbPath] : []
    }
    return {deps, targets, moduleDep: false}
  }
} else {
  const {deps, targets} = utils.processArgs(process.argv)
  const svgPath = targets[0]
  const kicadPcbPath = deps[0]
  const kicadPcb = fs.readFileSync(kicadPcbPath)
  const request = superagent
    .post('https://remote-processor.kitspace.org/process-file')
    .set('Authorization', `Bearer ${apiToken}`)
    .attach('upload', kicadPcb, 'x.kicad_pcb')
    .accept('application/json')
    .then(r => r.body.id)
    .then(async id => {
      const url = `https://remote-processor.kitspace.org/processed/status/${id}/images/layout.svg`
      let r = await superagent.get(url).accept('application/json')

      while (r.body.status !== 'done' && r.body.status !== 'failed') {
        r = await superagent.get(url).accept('application/json')
      }

      const svgUrl = `https://remote-processor.kitspace.org/processed/files/${id}/images/layout.svg`

      r = await superagent.get(svgUrl)
      fs.writeFileSync(svgPath, r.body)
    })

  Promise.race([
    request,
    new Promise((_, reject) =>
      setTimeout(
        () => reject(Error('Generating layout.svg timed out.')),
        120000
      )
    )
  ])
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err)
      process.exit(1)
    })
}

function findKicadPcbFile(inputDir, files, kitspaceYaml) {
  if (
    kitspaceYaml.eda &&
    kitspaceYaml.eda.type === 'kicad' &&
    kitspaceYaml.eda.pcb
  ) {
    return path.join(inputDir, kitspaceYaml.eda.pcb)
  } else {
    return files.find(file => file.endsWith('.kicad_pcb'))
  }
}

