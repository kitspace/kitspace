yaml = require "js-yaml"
fs   = require "fs"
ps   = require "process"

boards = []
boardDir = "pcbs"
boardJsPath = "build/boards.json"

fs.readdir boardDir, (err, files) ->

    if err?
        console.log("Error reading directory '#{err.path}': #{err.code}")
        ps.exit(1)

    success = true
    for dir in files
        path = "#{boardDir}/#{dir}/info.yaml"
        try
            doc = yaml.safeLoad(fs.readFileSync(path))
        catch e
            if e.name == "YAMLException"
                console.log("Error: could not parse '#{path}' line:#{e.mark.line} char:#{e.mark.position}")
                console.log("\tReason: ", e.reason)
            else
                console.log("Exception:", e)
            ps.exit(2)
        doc.folder = dir
        doc = correctTypes(doc)
        if doc.name == ""
            console.log("'#{path}' needs a name property")
            ps.exit(3)
        else if doc.version == ""
            console.log("'#{path}' needs a version property")
            ps.exit(4)
        boards.push(doc)
    boardJs = fs.openSync(boardJsPath, 'w')
    fs.write(boardJs, JSON.stringify(boards))
    console.log("Successfully generated '#{boardJsPath}'")


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
            if typeof(boardInfo[prop]) != "string"
                boardInfo[prop] = String(boardInfo[prop])
            boardInfoWithEmpty[prop] = boardInfo[prop]
    return boardInfoWithEmpty
