yaml = require "js-yaml"
fs   = require "fs"
ps   = require "process"

boards        = []
boardDir      = "pcbs"
boardJsonPath = "build/boards.json"

fs.readdir boardDir, (err, files) ->

    if err?
        console.log("Error reading directory '#{err.path}': #{err.code}")
        ps.exit(1)

    for dir in files
        path = "#{boardDir}/#{dir}/info.yaml"
        try
            doc = yaml.safeLoad(fs.readFileSync(path))
        catch e
            if e.name == "YAMLException"
                console.log("Error: could not parse '#{path}' line:#{e.mark.line} char:#{e.mark.position}")
                console.log("\tbecause ", e.reason)
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
    boardJson = fs.openSync(boardJsonPath, 'w')
    fs.write(boardJson, JSON.stringify(boards))
    console.log("Successfully generated '#{boardJsonPath}'")


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
