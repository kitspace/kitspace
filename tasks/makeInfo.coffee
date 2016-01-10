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
            bom = folder + '/1-click-BOM.tsv'
        deps = [folder, bom, 'build/.temp/boards.json']
        targets = ["build/.temp/#{folder}/info.json"]
        return {deps, targets}
else
    {deps, targets} = utils.processArgs(process.argv)
    [folder, bomPath, boardsJSON] = deps
    [infoPath] = targets

    boards = JSON.parse(fs.readFileSync(boardsJSON))
    info = {id:folder.replace('boards/','')}

    info.description = boards.reduce (prev, obj) ->
        if obj.id == info.id
            return obj.description
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
    info.bom = bom.lines

    repo = cp.execSync("cd #{folder} && git remote -v", {encoding:'utf8'})
    repo = repo.split('\t')[1].split(' ')[0]
    info.repo = repo

    fs.writeFileSync(infoPath, JSON.stringify(info))
