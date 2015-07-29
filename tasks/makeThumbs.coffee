fs           = require 'fs'
globule      = require('globule')
path         = require('path')
boardBuilder = require('svgerber-board-builder')
svg2png      = require('svg2png')
yaml         = require('js-yaml')
{checkArgs}  = require('./utils/utils')

getThumbPath = (folder) ->

if require.main != module
    module.exports = (folder) ->
        deps = ["#{folder}/1click-info.yaml"]
        deps = deps.concat(globule.find("#{folder}/gerbers/*"))
        imageDir = folder.replace('boards', 'build/boards') + '/images'
        targets = [
            "#{imageDir}/thumb.png"
            "/tmp/1clickBOM-build/#{folder}/top.svg"
        ]
        return {deps:deps, targets:targets}
else
    {deps, targets} = checkArgs(process.argv)
    png = targets[0]
    svgs = targets[1..]
    layers = []
    for p in deps[1..]
        layers.push({filename: path.basename(p)
          , gerber:fs.readFileSync(p, 'utf8')})
    info = yaml.safeLoad(fs.readFileSync(deps[0]))
    svg = boardBuilder(layers, info.rendering)
    top = fs.openSync(svgs[0], 'w')
    fs.writeSync(top, svg.top)
    fs.closeSync(top)
    svg2png svgs[0], png, {width:300, height:225}, () ->
