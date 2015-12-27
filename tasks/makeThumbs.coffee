fs           = require 'fs'
globule      = require('globule')
path         = require('path')
gerberToSvg  = require('gerber-to-svg')
svg2png      = require('svg2png')
yaml         = require('js-yaml')
{checkArgs}  = require('./utils/utils')
boardBuilder = require('./utils/boardBuilder')

if require.main != module
    module.exports = (folder) ->
        gerbers = globule.find("#{folder}/gerbers/*")
        if gerbers.length == 0
            console.error("No gerbers found for #{folder}.")
            process.exit(1)
        deps = [folder].concat(gerbers)
        imageDir = folder.replace('boards', 'build/boards') + '/images'
        targets = [
            "#{imageDir}/thumb.png"
            "/tmp/kitnic-build/#{folder}/top.svg"
        ]
        return {deps, targets}
else
    {deps, targets} = checkArgs(process.argv)
    folder = deps[0]
    png = targets[0]
    svgs = targets[1..]
    try
        file = fs.readFileSync("#{folder}/kitnic.yaml")
    try
        if file?
            info = yaml.safeLoad(file)
            stackup = boardBuilder(deps[1..], info.rendering)
        else
            stackup = boardBuilder(deps[1..])
    catch e
        console.error("Could not process gerbers for #{folder}")
        process.exit(1)
    fs.writeFileSync(svgs[0], gerberToSvg(stackup.top))
    svg2png svgs[0], png, {width:300, height:225}, () ->
