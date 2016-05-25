fs          = require('fs')
globule     = require('globule')
path        = require('path')
yaml        = require('js-yaml')
utils       = require('./utils/utils')
oneClickBOM = require('1-click-bom')
cp = require('child_process')

if require.main != module
    module.exports = (folder) ->
        try
            file = fs.readFileSync("#{folder}/kitnic.yaml")
        if file?
            info = yaml.safeLoad(file)
        if info?.bom?
            bom = folder + '/' + info.bom
        else
            bom = folder + '/1-click-bom.tsv'
        deps = ['build/.temp/boards.json', folder, bom]
        targets = ["build/.temp/#{folder}/info.json", "build/#{folder}/1-click-BOM.tsv"]
        return {deps, targets, moduleDep : false}
else
    {deps, targets} = utils.processArgs(process.argv)
    [boardsJSON, folder, bomPath] = deps
    [infoPath, outBomPath] = targets

    boards = JSON.parse(fs.readFileSync(boardsJSON))
    info = {id:folder.replace('boards/','')}

    info.summary = boards.reduce (prev, obj) ->
        if obj.id == info.id
            return obj.summary
        else
            return prev
    , ''

    try
        file = fs.readFileSync("#{folder}/kitnic.yaml")
    if file?
        kitnicYaml = yaml.safeLoad(file)
    info.site = if kitnicYaml?.site? then kitnicYaml.site else ''

    tsv = fs.readFileSync(bomPath, {encoding:'utf8'})
    bom = oneClickBOM.parseTSV(tsv)
    info.bom = {}
    info.bom.lines = bom.lines
    info.bom.tsv = oneClickBOM.writeTSV(bom.lines)

    repo = cp.execSync("cd #{folder} && git remote -v", {encoding:'utf8'})
    repo = repo.split('\t')[1].split(' ')[0]
    info.repo = repo

    fs.writeFile(infoPath, JSON.stringify(info), ->)

    fs.writeFile(outBomPath, info.bom.tsv, ->)
