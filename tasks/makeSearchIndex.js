const fs = require('fs')
const utils = require('./utils/utils')
const {parseProjects} = require('./utils/parseProjects')

if (require.main !== module) {
  module.exports = function(config) {
    const targets = ['build/.temp/search_index.json']
    const {cached_build} = utils.processArgs(process.argv)

    const boards = parseProjects(config, cached_build)
    const boardsInfoPaths = boards.map(
      b => `build/.temp/boards/${b.id}/info.json`
    )

    return {deps: boardsInfoPaths, targets, moduleDep: false}
  }
} else {
  const {deps, targets} = utils.processArgs(process.argv)

  const paths = deps
  const indices = []

  paths.forEach(p => {
    const info = JSON.parse(fs.readFileSync(p).toString())
    const index = {
      id: info.id,
      summary: info.summary,
      bom: info.bom.lines
        .map(l => {
          const description = l.description
          const MPN = l.partNumbers.map(p => p.part)

          return [description, MPN].filter(field => field !== '').toString()
        })
        .filter(l => l !== '')
        .join('')
    }
    indices.push(index)
  })

  fs.writeFileSync(targets[0], JSON.stringify(indices))
}
