const fs = require('fs')
const utils = require('./utils/utils')

if (require.main !== module) {
  module.exports = function(config) {
    let deps
    const targets = ['build/bom-builder/index.html']
    if (config === 'production') {
      deps = [
        'build/.temp/bom-builder/bom-builder.jsx',
        'src/bom-builder/bom-builder.html',
      ]
      return {deps, targets, moduleDep: true}
    } else if (config === 'dev') {
      deps = ['src/bom-builder/bom-builder.html']
      return {deps, targets, moduleDep: false}
    }
  }
} else {
  let html
  const {config, deps, targets} = utils.processArgs(process.argv)
  const index = targets[0]
  if (config === 'production') {
    //do server-side rendering
    const jsx = deps[0]
    html = deps[1]
    utils.reactRender(jsx, html, index)
  } else if (config === 'dev') {
    //just copy the index.html
    html = deps[0]
    fs.createReadStream(html).pipe(fs.createWriteStream(index))
  }
}
