fs           = require 'fs'
globule      = require('globule')
path         = require('path')
yaml         = require('js-yaml')
Svgo         = require('svgo')
utils        = require('./utils/utils')
boardBuilder = require('./utils/boardBuilder')
cp = require('child_process')
Jszip = require('jszip')


svgo = new Svgo
    full : true
    plugins : [
        { removeDoctype                  : true  }
        { removeXMLProcInst              : true  }
        { removeComments                 : true  }
        { removeMetadata                 : true  }
        { removeEditorsNSData            : true  }
        { cleanupAttrs                   : true  }
        { minifyStyles                   : true  }
        { convertStyleToAttrs            : true  }
        { cleanupIDs                     : true  }
        { removeRasterImages             : true  }
        { removeUselessDefs              : true  }
        { cleanupNumericValues           : true  }
        { cleanupListOfValues            : true  }
        { convertColors                  : true  }
        { removeUnknownsAndDefaults      : true  }
        { removeNonInheritableGroupAttrs : true  }
        { removeUselessStrokeAndFill     : true  }
        { removeViewBox                  : true  }
        { cleanupEnableBackground        : true  }
        { removeHiddenElems              : true  }
        { removeEmptyText                : true  }
        { convertShapeToPath             : true  }
        { moveElemsAttrsToGroup          : false }
        { moveGroupAttrsToElems          : true  }
        { collapseGroups                 : true  }
        { convertPathData                : true  }
        { convertTransform               : true  }
        { removeEmptyAttrs               : true  }
        { removeEmptyContainers          : true  }
        { mergePaths                     : true  }
        { removeUnusedNS                 : true  }
        { transformsWithOnePath          : true  }
        { sortAttrs                      : true  }
        { removeTitle                    : true  }
        { removeDesc                     : true  }
        { removeDimensions               : true  }
        { removeAttrs                    : true  }
        { addClassesToSVGElement         : false }
        { removeStyleElement             : false }
    ]

if require.main != module
    module.exports = (folder) ->
        try
            file = fs.readFileSync("#{folder}/kitnic.yaml")
        if file?
            info = yaml.safeLoad(file)
        if info?.gerbers?
            gerbers = globule.find("#{folder}/#{info.gerbers}/*")
        else
            gerbers = globule.find("#{folder}/gerbers/*")
        if gerbers.length == 0
            console.error("No gerbers found for #{folder}.")
            process.exit(1)
        deps = [folder].concat(gerbers)
        buildFolder = folder.replace('boards', 'build/boards')
        version = cp.execSync("cd #{folder} && git log -n 1 --oneline"
        , {encoding:'utf8'})
        version = version.split(' ')[0]
        zip = "#{path.basename(folder)}-#{version}-gerbers.zip"
        targets = [
            "#{buildFolder}/images/top.svg"
            "#{buildFolder}/images/bottom.svg"
            "#{buildFolder}/#{zip}"
            "build/.temp/#{folder}/zip-info.json"
        ]
        return {deps, targets, moduleDep:false}
else
    {config, deps, targets} = utils.processArgs(process.argv)
    folder = deps[0]
    gerbers = deps[1..]
    [topSvgPath, bottomSvgPath, zipPath, zipInfoPath] = targets
    fs.writeFileSync(zipInfoPath, JSON.stringify(path.basename(zipPath)))
    zip = new Jszip
    zip = zip.folder(path.basename(zipPath, '.zip'))
    try
        file = fs.readFileSync("#{folder}/kitnic.yaml")
    try
        fs.writeFile zipPath
        , zip.generate
            type:'nodebuffer'
            compression:'DEFLATE'
            compressionOptions : {level:6}
        , (err) ->
            if err?
                console.error("Could not write gerber zip for #{folder}")
                console.error(err)
                process.exit(1)
        stackupData = []
        for gerberPath in gerbers
            data = fs.readFileSync(gerberPath, {encoding:'utf8'})
            stackupData.push({filename:gerberPath, gerber:data})
            zip.file(path.basename(gerberPath), data)
        if file? then color = yaml.safeLoad(file).color
        boardBuilder stackupData, color || 'green', (error, stackup) ->
            if error?
                throw error
            svgo.optimize stackup.top, (result) ->
                fs.writeFile topSvgPath, result.data, (err) ->
                    if err?
                        console.error("Could not write top svg for #{folder}")
                        console.error(err)
                        process.exit(1)

            svgo.optimize stackup.bottom, (result) ->
                fs.writeFile bottomSvgPath, result.data, (err) ->
                    if err?
                        console.error("Could not write bottom svg for #{folder}")
                        console.error(err)
                        process.exit(1)


    catch e
        console.error("Could not process gerbers for #{folder}")
        console.error(e)
        process.exit(1)
