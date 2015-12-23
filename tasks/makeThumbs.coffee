fs           = require 'fs'
globule      = require('globule')
path         = require('path')
gerberToSvg  = require('gerber-to-svg')
svg2png      = require('svg2png')
yaml         = require('js-yaml')
{checkArgs}  = require('./utils/utils')
boardBuilder = require('./utils/boardBuilder')

getThumbPath = (folder) ->

if require.main != module
    module.exports = (folder) ->
        deps = ["#{folder}/kitnic.yaml"]
        deps = deps.concat(globule.find("#{folder}/gerbers/*"))
        imageDir = folder.replace('boards', 'build/boards') + '/images'
        targets = [
            "#{imageDir}/thumb.png"
            "/tmp/kitnic-build/#{folder}/top.svg"
        ]
        return {deps:deps, targets:targets}
else
    {deps, targets} = checkArgs(process.argv)
    png = targets[0]
    svgs = targets[1..]
    info = yaml.safeLoad(fs.readFileSync(deps[0]))
    stackup = boardBuilder(deps[1..], info.rendering)
    fs.writeFileSync(svgs[0], gerberToSvg(stackup.top))
    svg2png svgs[0], png, {width:300, height:225}, () ->
