yaml = require('js-yaml')
fs   = require('fs')

boards        = []
boardDir      = "pcbs"
boardJsonPath = "build/boards.json"

if require.main != module
    exports.deps = () ->
        dirs = fs.readdirSync(boardDir)
        return ("#{boardDir}/#{dir}/info.yaml" for dir in dirs)

    exports.targets = () ->
        [boardJsonPath]
else
    correctTypes = (boardInfo) ->
        boardInfoWithEmpty =
            { name        : ""
            , folder      : ""
            , description : ""
            , author      : ""
            , version     : ""
            , site        : ""
            , license     : ""
            }
        for prop of boardInfoWithEmpty
            if (boardInfo.hasOwnProperty(prop))
                boardInfoWithEmpty[prop] = String(boardInfo[prop])
        return boardInfoWithEmpty

    paths = process.argv.slice(2)
    for path in paths
        doc = correctTypes(yaml.safeLoad(fs.readFileSync(path)))
        if doc.name == ""
            console.log("'#{path}' needs a name property")
            ps.exit(3)
        else if doc.version == ""
            console.log("'#{path}' needs a version property")
            ps.exit(4)
        boards.push(doc)

    boardJson = fs.openSync(boardJsonPath, 'w')
    fs.write(boardJson, JSON.stringify(boards))
