fs           = require 'fs'
globule      = require('globule')
path         = require('path')
boardBuilder = require('svgerber-board-builder')
svg2png      = require('svg2png')
boardDir = 'boards'
{checkArgs}  = require('./utils/utils')

getThumbPath = (folder) ->

if require.main != module
    module.exports = (folder) ->
        exports.deps = globule.find("#{folder}/gerbers/*")
        imageDir = folder.replace(boardDir, 'build') + '/images'
        exports.targets = [
            "#{imageDir}/thumb.png"
            "#{imageDir}/top.svg"
            "#{imageDir}/bottom.svg"
        ]
        return exports
else
    {deps, targets} = checkArgs(process.argv)
    png = targets[0]
    svgs = targets[1..]
    layers = []
    for p in deps
        layers.push({filename: path.basename(p)
          , gerber:fs.readFileSync(p, 'utf8')})
    svg = boardBuilder(layers)
    top = fs.openSync(svgs[0], 'w')
    bottom = fs.openSync(svgs[1], 'w')
    fs.writeSync(top, svg.top)
    fs.writeSync(bottom, svg.bottom)
    fs.closeSync(top)
    fs.closeSync(bottom)
    svg2png svgs[0], png, {width:200, height:150}, () ->
