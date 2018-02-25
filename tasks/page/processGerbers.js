const fs = require('fs')
const globule = require('globule')
const path = require('path')
const yaml = require('js-yaml')
const Svgo = require('svgo')
const utils = require('../utils/utils')
const boardBuilder = require('../../src/board_builder')
const cp = require('child_process')
const Jszip = require('jszip')
const gerberFiles = require('../../src/gerber_files')

const svgo = new Svgo({
  full: true,
  plugins: [
    {removeDoctype: true},
    {removeXMLProcInst: true},
    {removeComments: true},
    {removeMetadata: true},
    {removeEditorsNSData: true},
    {cleanupAttrs: true},
    {minifyStyles: false},
    {convertStyleToAttrs: true},
    {cleanupIDs: true},
    {removeRasterImages: true},
    {removeUselessDefs: true},
    {cleanupNumericValues: true},
    {cleanupListOfValues: true},
    {convertColors: true},
    {removeUnknownsAndDefaults: true},
    {removeNonInheritableGroupAttrs: true},
    {removeUselessStrokeAndFill: true},
    {removeViewBox: true},
    {cleanupEnableBackground: true},
    {removeHiddenElems: true},
    {removeEmptyText: true},
    {convertShapeToPath: true},
    {moveElemsAttrsToGroup: false},
    {moveGroupAttrsToElems: true},
    {collapseGroups: false},
    {convertPathData: true},
    {convertTransform: true},
    {removeEmptyAttrs: true},
    {removeEmptyContainers: true},
    {mergePaths: true},
    {removeUnusedNS: true},
    {transformsWithOnePath: true},
    {sortAttrs: true},
    {removeTitle: true},
    {removeDesc: true},
    {removeDimensions: true},
    {removeAttrs: true},
    {addClassesToSVGElement: false},
    {removeStyleElement: false}
  ]
})

if (require.main !== module) {
  module.exports = function(config, folder) {
    let file, gerbers, info
    try {
      file = fs.readFileSync(`${folder}/kitnic.yaml`)
    } catch (error) {}
    if (file != null) {
      info = yaml.safeLoad(file)
    }
    if (__guard__(info, x => x.gerbers) != null) {
      gerbers = globule.find(`${folder}/${info.gerbers}/*`)
    } else {
      const files = globule.find(`${folder}/**/*`)
      gerbers = gerberFiles(files)
    }
    if (gerbers.length === 0) {
      console.error(`No gerbers found for ${folder}.`)
      process.exit(1)
    }
    const deps = [folder].concat(gerbers)
    const buildFolder = folder.replace('boards', 'build/boards')
    let version = cp.execSync(`cd ${folder} && git log -n 1 --oneline`, {
      encoding: 'utf8'
    })
    version = version.split(' ')[0]
    const zip = `${path.basename(folder)}-${version}-gerbers.zip`
    const targets = [
      `${buildFolder}/images/top.svg`,
      `${buildFolder}/images/bottom.svg`,
      `${buildFolder}/${zip}`,
      `build/.temp/${folder}/zip-info.json`,
      `build/.temp/${folder}/unoptimized-top.svg`,
      `${buildFolder}/images/top.png`,
      `${buildFolder}/images/top-large.png`
    ]
    return {deps, targets, moduleDep: false}
  }
} else {
  let file
  const {config, deps, targets} = utils.processArgs(process.argv)
  const folder = deps[0]
  const gerbers = deps.slice(1)
  const [
    topSvgPath,
    bottomSvgPath,
    zipPath,
    zipInfoPath,
    unOptimizedSvgPath,
    topPngPath,
    topLargePngPath
  ] = targets
  const zipInfo = {
    zipPath: path.basename(zipPath),
    folder
  }
  const zip = new Jszip()
  const folder_name = path.basename(zipPath, '.zip')
  try {
    file = fs.readFileSync(`${folder}/kitnic.yaml`)
  } catch (error) {}
  try {
    let color, data
    const stackupData = []
    for (let gerberPath of gerbers) {
      data = fs.readFileSync(gerberPath, {encoding: 'utf8'})
      stackupData.push({filename: gerberPath, gerber: data})
      zip.file(path.join(folder_name, path.basename(gerberPath)), data)
    }
    zip
      .generateAsync({
        type: 'nodebuffer',
        compression: 'DEFLATE',
        compressionOptions: {level: 6}
      })
      .then(content =>
        fs.writeFile(zipPath, content, function(err) {
          if (err != null) {
            console.error(`Could not write gerber zip for ${folder}`)
            throw err
          }
        })
      )
    if (file != null) {
      ;({color} = yaml.safeLoad(file))
    }
    boardBuilder(stackupData, color || 'green', function(error, stackup) {
      if (error != null) {
        throw error
      }
      zipInfo.width = Math.max(stackup.top.width, stackup.bottom.width)
      zipInfo.height = Math.max(stackup.top.height, stackup.bottom.height)
      if (stackup.top.units === 'in') {
        if (stackup.bottom.units !== 'in') {
          console.error('We got a weird board with disparate units:', folder)
          process.exit(1);
        }
        zipInfo.width *= 25.4
        zipInfo.height *= 25.4
      }
      zipInfo.width = Math.ceil(zipInfo.width)
      zipInfo.height = Math.ceil(zipInfo.height)
      fs.writeFileSync(zipInfoPath, JSON.stringify(zipInfo))

      fs.writeFile(unOptimizedSvgPath, stackup.top.svg, function(err) {
        if (err != null) {
          console.error(`Could not write unoptimized top svg for ${folder}`)
          console.error(err)
          return process.exit(1)
        }
        let cmd = `inkscape --without-gui '${unOptimizedSvgPath}'`
        cmd += ` --export-png='${topPngPath}'`
        if (stackup.top.width > stackup.top.height + 0.05) {
          cmd += ' --export-width=240'
        } else {
          cmd += ' --export-height=180'
        }
        cp.exec(cmd, err => {
          if (err) {
            console.error(err)
            return process.exit(1)
          }
        })
        let cmd_large = `inkscape --without-gui '${unOptimizedSvgPath}'`
        cmd_large += ` --export-png='${topLargePngPath}'`
        if (stackup.top.width > stackup.top.height + 0.05) {
          cmd_large += ` --export-width=${240 * 3 - 128}`
        } else {
          cmd_large += ` --export-height=${180 * 3 - 128}`
        }
        cp.exec(cmd_large, err => {
          if (err) {
            console.error(err)
            return process.exit(1)
          }
        })
      })
      fs.writeFile(topSvgPath, stackup.top.svg, function(err) {
        if (err != null) {
          console.error(`Could not write top svg for ${folder}`)
          console.error(err)
          return process.exit(1)
        }
      })
      fs.writeFile(bottomSvgPath, stackup.bottom.svg, function(err) {
        if (err != null) {
          console.error(`Could not write bottom svg for ${folder}`)
          console.error(err)
          return process.exit(1)
        }
      })
    })
  } catch (e) {
    console.error(`Could not process gerbers for ${folder}`)
    console.error(e)
    process.exit(1)
  }
}

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined
}
