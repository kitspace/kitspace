const fs = require('fs')
const globule = require('globule')
const path = require('path')
const yaml = require('js-yaml')
const utils = require('../utils/utils')
const boardBuilder = require('../../src/board_builder')
const cp = require('child_process')
const Jszip = require('jszip')
const gerberFiles = require('../../src/gerber_files')

if (require.main !== module) {
  module.exports = function(config, boardInfo) {
    let gerberPath = path.join(boardInfo.boardPath, '**', '*')

    if (boardInfo.gerbers) {
      gerberPath = path.join(boardInfo.repoPath, boardInfo.gerbers, '*')
    }

    const files = globule
      .find(gerberPath)
      .map(p => path.relative(boardInfo.repoPath, p))

    let gerbers = gerberFiles(files, boardInfo.gerbers).map(p =>
      path.join(boardInfo.repoPath, p)
    )
    if (gerbers.length < 2) {
      let kicadPcbFile
      if (
        boardInfo.eda &&
        boardInfo.eda.type === 'kicad' &&
        boardInfo.eda.pcb != null
      ) {
        kicadPcbFile = boardInfo.eda.pcb
      } else if (boardInfo.eda == null) {
        const kicadPcbPattern = path.join(boardInfo.repoPath, '**/*.kicad_pcb')
        kicadPcbFile = globule.find(kicadPcbPattern)[0]
      }
      if (kicadPcbFile != null) {
        gerbers = [path.join(boardInfo.repoPath, kicadPcbFile)]
      } else {
        console.error(
          `No gerbers or .kicad_pcb found for ${boardInfo.repoPath}.`
        )
        process.exit(1)
      }
    }
    const deps = [boardInfo.repoPath].concat(gerbers)
    const buildFolder = boardInfo.boardPath.replace('boards', 'build/boards')
    let version = cp.execSync(
      `cd '${boardInfo.repoPath}' && git log -n 1 --oneline`,
      {
        encoding: 'utf8'
      }
    )
    version = version.split(' ')[0]
    const zip = `${path.basename(boardInfo.boardPath)}-${version}-gerbers.zip`
    const targets = [
      `${buildFolder}/images/top.svg`,
      `${buildFolder}/images/bottom.svg`,
      `${buildFolder}/${zip}`,
      `build/.temp/${boardInfo.boardPath}/zip-info.json`,
      `build/.temp/${boardInfo.boardPath}/unoptimized-top.svg`,
      `${buildFolder}/images/top.png`,
      `${buildFolder}/images/top-large.png`,
      `${buildFolder}/images/top-meta.png`,
      `${buildFolder}/images/top-with-background.png`
    ]
    return {deps, targets, moduleDep: false}
  }
} else {
  const {config, deps, targets} = utils.processArgs(process.argv)
  const root = deps[0]
  let gerbers = deps.slice(1)

  if (gerbers.length === 1 && path.extname(gerbers[0]) === '.kicad_pcb') {
    const kicadPcbFile = gerbers[0]
    const gerberFolder = path.join('/tmp/kitspace', root, 'gerbers')
    const plot_kicad_gerbers = path.join(__dirname, 'plot_kicad_gerbers')
    const cmd_plot = `${plot_kicad_gerbers} ${kicadPcbFile} ${gerberFolder}`
    cp.execSync(`mkdir -p ${gerberFolder}`)
    cp.execSync(cmd_plot)
    gerbers = globule.find(path.join(gerberFolder, '*'))
  }
  const [
    topSvgPath,
    bottomSvgPath,
    zipPath,
    zipInfoPath,
    unOptimizedSvgPath,
    topPngPath,
    topLargePngPath,
    topMetaPngPath,
    topWithBgndPath
  ] = targets

  const zipInfo = {
    zipPath: path.basename(zipPath),
    folder: path.relative('build/', path.dirname(zipPath))
  }
  const zip = new Jszip()

  try {
    let data
    const stackupData = []
    for (const gerberPath of gerbers) {
      data = fs.readFileSync(gerberPath, {encoding: 'utf8'})
      stackupData.push({filename: path.basename(gerberPath), gerber: data})
      const folder_name = path.basename(zipPath, '.zip')
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
            console.error(`Could not write gerber zip for ${root}`)
            throw err
          }
        })
      )

    let file, color
    if (fs.existsSync(`${root}/kitnic.yaml`)) {
      file = fs.readFileSync(`${root}/kitnic.yaml`)
    } else if (fs.existsSync(`${root}/kitspace.yaml`)) {
      file = fs.readFileSync(`${root}/kitspace.yaml`)
    } else if (fs.existsSync(`${root}/kitspace.yml`)) {
      file = fs.readFileSync(`${root}/kitspace.yml`)
    }

    const multiKey = path.relative(
      path.join('build', root),
      path.dirname(zipPath)
    )

    if (file != null) {
      info = yaml.safeLoad(file)
      if (info.multi && multiKey) {
        color = info.multi[multiKey].color
      } else {
        color = info.color
      }
    }
    boardBuilder(stackupData, color || 'green', function(error, stackup) {
      if (error != null) {
        throw error
      }
      zipInfo.width = Math.max(stackup.top.width, stackup.bottom.width)
      zipInfo.height = Math.max(stackup.top.height, stackup.bottom.height)
      if (stackup.top.units === 'in') {
        if (stackup.bottom.units !== 'in') {
          console.error('We got a weird board with disparate units:', root)
          process.exit(1)
        }
        zipInfo.width *= 25.4
        zipInfo.height *= 25.4
      }
      zipInfo.width = Math.ceil(zipInfo.width)
      zipInfo.height = Math.ceil(zipInfo.height)
      zipInfo.layers = stackup.layers.filter(layer => {
        return layer.type.includes('cu') // copper layers - tcu, bcu, icu
      }).length
      fs.writeFileSync(zipInfoPath, JSON.stringify(zipInfo))

      fs.writeFile(unOptimizedSvgPath, stackup.top.svg, function(err) {
        if (err != null) {
          console.error(`Could not write unoptimized top svg for ${root}`)
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
        let cmd_meta = `inkscape --without-gui '${unOptimizedSvgPath}'`
        cmd_meta += ` --export-png='${topMetaPngPath}'`
        const width = 900
        let height = 400
        const ratioW = width / stackup.top.width
        if (ratioW * stackup.top.height > height) {
          let ratioH = height / stackup.top.height
          while (ratioH * stackup.top.width > width) {
            height -= 1
            ratioH = height / stackup.top.height
          }
          cmd_meta += ` --export-height=${height}`
        } else {
          cmd_meta += ` --export-width=${width}`
        }
        cp.exec(cmd_meta, err => {
          if (err) {
            console.error(err)
            return process.exit(1)
          }
          const cmd = `convert -background '#373737' -gravity center '${topMetaPngPath}' -extent 1000x524 '${topWithBgndPath}'`
          cp.exec(cmd, err => {
            if (err) {
              console.error(err)
              return process.exit(1)
            }
          })
        })
      })
      fs.writeFile(topSvgPath, stackup.top.svg, function(err) {
        if (err != null) {
          console.error(`Could not write top svg for ${root}`)
          console.error(err)
          return process.exit(1)
        }
      })
      fs.writeFile(bottomSvgPath, stackup.bottom.svg, function(err) {
        if (err != null) {
          console.error(`Could not write bottom svg for ${root}`)
          console.error(err)
          return process.exit(1)
        }
      })
    })
  } catch (e) {
    console.error(`Could not process gerbers for ${root}`)
    console.error(e)
    process.exit(1)
  }
}

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined
}
