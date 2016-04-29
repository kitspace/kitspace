fs          = require('fs')
globule     = require('globule')
path        = require('path')
yaml        = require('js-yaml')
utils       = require('./utils/utils')
oneClickBOM = require('1-click-bom')
cp = require('child_process')
utf8 = require('to-utf-8')

if require.main != module
    module.exports = (folder) ->
        try
            file = fs.readFileSync("#{folder}/kitnic.yaml")
        if file?
            info = yaml.safeLoad(file)
        if info?.bom?
            bom = folder + '/' + info.bom
        else
            bom = folder + '/1-click-BOM.tsv'
        deps = ['build/.temp/boards.json', folder, bom]
        targets = ["build/.temp/#{folder}/info.json", "build/#{folder}/1-click-BOM.tsv"]
        return {deps, targets, moduleDep : false}
else
    {deps, targets} = utils.processArgs(process.argv)
    [boardsJSON, folder, bomPath] = deps
    [infoPath, outBomPath] = targets

    boards = JSON.parse(fs.readFileSync(boardsJSON))
    info = {id:folder.replace('boards/','')}

    info.description = boards.reduce (prev, obj) ->
        if obj.id == info.id
            return obj.description
        else
            return prev
    , ''

    try
        file = fs.readFileSync("#{folder}/kitnic.yaml", 'utf8')
    if file?
        kitnicYaml = yaml.safeLoad(file)
    info.site = if kitnicYaml?.site? then kitnicYaml.site else ''

    stream = fs.createReadStream(bomPath)
        .pipe(utf8())

    tsv = ''
    stream.on 'data', (chunk) ->
        tsv += chunk.toString()

    stream.on 'end', () ->
        bom = oneClickBOM.parseTSV(tsv)
        info.bom = bom.lines

        repo = cp.execSync("cd #{folder} && git remote -v", {encoding:'utf8'})
        repo = repo.split('\t')[1].split(' ')[0]
        info.repo = repo

        fs.writeFile(infoPath, JSON.stringify(info), ->)

        tsvOut = oneClickBOM.writeTSV(bom.lines)
        fs.writeFile(outBomPath, tsvOut, ->)
