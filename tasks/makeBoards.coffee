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
    folders.sort((a,b) ->
        return (a.toLowerCase() > b.toLowerCase())
    )
    for folder in folders
        try
            file = fs.readFileSync("#{folder}/kitnic.yaml")
        info = correctTypes(yaml.safeLoad(file))
        info.id = path.relative(boardDir, folder)
        boards.push(info)

    boardJson = fs.openSync(targets[0], 'w')
    fs.write(boardJson, JSON.stringify(boards))
