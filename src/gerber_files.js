const whatsThatGerber = require('whats-that-gerber')
const path = require('path')

function gerberFiles(files, gerberPath) {
  if (gerberPath != null) {
    files = files.filter(f => f.startsWith(gerberPath))
  }
  const layers = whatsThatGerber(files)
  const possibleGerbers = Object.keys(layers).filter(
    k => layers[k].type != null
  )
  let duplicates = false
  const types = []
  for (const k of possibleGerbers) {
    if (
      types.find(
        t =>
          t.type === layers[k].type &&
          t.side === layers[k].side &&
          t.side !== 'inner'
      ) != null
    ) {
      duplicates = true
      break
    } else {
      types.push(layers[k])
    }
  }
  if (!duplicates) {
    return possibleGerbers
  }
  //if we have duplicates we reduce it down to the folder with the most
  //gerbers
  const folders = possibleGerbers.reduce((folders, f) => {
    const name = path.dirname(f)
    folders[name] = (folders[name] || 0) + 1
    return folders
  }, {})
  const gerberFolder = Object.keys(folders).reduce((prev, f) => {
    if (folders[f] > folders[prev]) {
      return f
    }
    return prev
  })
  return possibleGerbers.filter(f => path.dirname(f) === gerberFolder)
}

module.exports = gerberFiles
