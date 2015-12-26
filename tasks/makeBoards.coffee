yaml        = require('js-yaml')
fs          = require('fs')
path        = require('path')
globule     = require('globule')
{checkArgs} = require('./utils/utils')

boardDir = 'boards'

if require.main != module
    exports.deps = [boardDir]
    exports.targets = ['build/boards.json']
else
    correctTypes = (boardInfo) ->
        boardInfoWithEmpty =
            { name        : ''
            , description : ''
            , site        : ''
            , license     : ''
            }
        for prop of boardInfoWithEmpty
            if (boardInfo.hasOwnProperty(prop))
                boardInfoWithEmpty[prop] = String(boardInfo[prop])
        return boardInfoWithEmpty

    {deps, targets} = checkArgs(process.argv)
    boards = []
    folders = globule.find("#{boardDir}/*/*", {filter: 'isDirectory'})
    for folder in folders
        doc = correctTypes(yaml.safeLoad(fs.readFileSync("#{folder}/kitnic.yaml")))
        id = path.relative(boardDir, folder)
        doc.id = id
        boards.push(doc)

    boardJson = fs.openSync(targets[0], 'w')
    fs.write(boardJson, JSON.stringify(boards))
