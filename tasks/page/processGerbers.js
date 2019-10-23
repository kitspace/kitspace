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
  module.exports = function(config, folder) {
    let file, projectPath, repoRootPath

    repoFolders = folder.split('/')
    if (repoFolders.length > 4) {
      repoRootPath = repoFolders.slice(0, 4).join('/')
      projectPath = repoFolders.splice(4).join('/')
    } else {
      repoRootPath = folder
    }

    if (fs.existsSync(`${repoRootPath}/kitnic.yaml`)) {
      file = fs.readFileSync(`${repoRootPath}/kitnic.yaml`)
    } else if (fs.existsSync(`${repoRootPath}/kitspace.yaml`)) {
      file = fs.readFileSync(`${repoRootPath}/kitspace.yaml`)
    } else if (fs.existsSync(`${repoRootPath}/kitspace.yml`)) {
      file = fs.readFileSync(`${repoRootPath}/kitspace.yml`)
    }
    let info = file == null ? {} : yaml.safeLoad(file)
    let gerberPath = path.join(repoRootPath, '**', '*')

    if (info.multi) {
      for (let project in info.multi) {
        if (project === projectPath) {
          info = info.multi[project]
          if (info.gerbers) {
            gerberPath = path.join(repoRootPath, info.gerbers, '*')
          } else {
            gerberPath = path.join(repoRootPath, projectPath, '**', '*')
          }
        }
      }
    }

    const files = globule
      .find(gerberPath)
      .map(p => path.relative(repoRootPath, p))

    const gerbers = gerberFiles(files, info.gerbers).map(p =>
      path.join(repoRootPath, p)
    )
    if (gerbers.length === 0) {
      console.error(`No gerbers found for ${repoRootPath}.`)
      process.exit(1)
    }
    const deps = [folder].concat(gerbers)
    const buildFolder = folder.replace('boards', 'build/boards')
    let version = cp.execSync(`cd '${folder}' && git log -n 1 --oneline`, {
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
      `${buildFolder}/images/top-large.png`,
      `${buildFolder}/images/top-meta.png`,
      `${buildFolder}/images/top-with-background.png`
    ]
    return {deps, targets, moduleDep: false}
  }
} else {
  const {config, deps, targets} = utils.processArgs(process.argv)
  const folder = deps[0]
  const gerbers = deps.slice(1)
  let file
  let root = folder
  let projectPath
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
    folder
  }
  const zip = new Jszip()
  const folder_name = path.basename(zipPath, '.zip')

  repoStructure = folder.split('/')
  if (repoStructure.length > 4) {
    root = repoStructure.slice(0, 4).join('/')
    projectPath = repoStructure.splice(4).join('/')
  }

  if (fs.existsSync(`${root}/kitnic.yaml`)) {
    file = fs.readFileSync(`${root}/kitnic.yaml`)
  } else if (fs.existsSync(`${root}/kitspace.yaml`)) {
    file = fs.readFileSync(`${root}/kitspace.yaml`)
  } else if (fs.existsSync(`${root}/kitspace.yml`)) {
    file = fs.readFileSync(`${root}/kitspace.yml`)
  }
  try {
    let color, data
    const stackupData = []
    for (let gerberPath of gerbers) {
      data = fs.readFileSync(gerberPath, {encoding: 'utf8'})
      stackupData.push({filename: path.basename(gerberPath), gerber: data})
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
      info = yaml.safeLoad(file)
      if (info.multi) {
        for (let project in info.multi) {
          if (project === projectPath) {
            color = info.multi[project].color
          }
        }
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
          console.error('We got a weird board with disparate units:', folder)
          process.exit(1)
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
