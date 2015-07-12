fs     = require 'fs'
xml2js = require 'xml2js'
ps     = require "process"
cp     = require "child_process"

parser = new xml2js.Parser()

makeThumb = (dir) ->
    @filePath = "#{__dirname}/pcbs/#{dir}/images/top.svg"
    @exportPath = "#{__dirname}/pcbs/#{dir}/images/thumb.png"
    fs.readFile @filePath, (err, data) =>
        parser.parseString data, (err, result) =>
            width   = parseFloat(result.svg.$.width)
            height  = parseFloat(result.svg.$.height)
            aspect  = width / height
            eWidth  = if (width >  height) then 200 else aspect * 150
            eHeight = if (width <= height) then 150 else 200 / aspect
            cp.exec "inkscape --without-gui
                    --export-width=#{eWidth}
                    --export-height=#{eHeight}
                    --export-png=#{@exportPath}
                    #{@filePath}"
                    , (err, stdout, stderr) ->
                console.log('stdout: ' + stdout)
                console.log('stderr: ' + stderr)
                if err?
                  console.log('exec error: ' + error)

makeThumb('bus-pirate')
