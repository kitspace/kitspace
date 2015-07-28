yaml        = require('js-yaml')
fs          = require('fs')
path        = require('path')
globule     = require('globule')
{checkArgs} = require('./utils/utils')

boardDir = 'boards'

if require.main != module
    exports.deps = globule.find("#{boardDir}/**/1click-info.yaml")
    exports.targets = ['build/boards.json']
else
    correctTypes = (boardInfo) ->
        boardInfoWithEmpty =
            { name        : ''
            , folder      : ''
            , description : ''
            , author      : ''
            , version     : ''
            , site        : ''
            , license     : ''
            }
        for prop of boardInfoWithEmpty
            if (boardInfo.hasOwnProperty(prop))
                boardInfoWithEmpty[prop] = String(boardInfo[prop])
        return boardInfoWithEmpty

    {deps, targets} = checkArgs(process.argv)
    boards = []
    for p in deps
        doc = correctTypes(yaml.safeLoad(fs.readFileSync(p)))
        if doc.name == ''
            console.log("'#{p}' needs a name property")
            process.exit(2)
        else if doc.version == ''
            console.log("'#{p}' needs a version property")
            process.exit(3)
        doc.folder = path.dirname(path.relative(boardDir, p))
        boards.push(doc)

    boardJson = fs.openSync(targets[0], 'w')
    fs.write(boardJson, JSON.stringify(boards))
