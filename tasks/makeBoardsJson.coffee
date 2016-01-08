yaml        = require('js-yaml')
fs          = require('fs')
path        = require('path')
globule     = require('globule')
utils       = require('./utils/utils')
cp          = require('child_process')

boardDir = 'boards'

if require.main != module

    exports.deps = [boardDir]
    exports.targets = ['build/.temp/boards.json']

else

    getGithubInfo = (id) ->
        url =  "https://api.github.com/repos#{id.replace(/^github.com/,'')}"
        if process?.env?.GH_TOKEN? #we use this avoid being rate-limited
            text = cp.execSync("curl -u kasbah:#{process.env.GH_TOKEN} #{url}")
        else
            console.warn('Using un-authenticated access to GitHub API')
            text = cp.execSync("curl #{url}")
        return JSON.parse(text)

    correctTypes = (boardInfo) ->
        boardInfoWithEmpty =
            { id : ''
            , description : ''
            }
        for prop of boardInfoWithEmpty
            if (boardInfo.hasOwnProperty(prop))
                boardInfoWithEmpty[prop] = String(boardInfo[prop])
        return boardInfoWithEmpty


    {deps, targets} = utils.processArgs(process.argv)
    boards = []
    folders = globule.find("#{boardDir}/*/*/*", {filter: 'isDirectory'})
    folders.sort((a,b) ->
        return (a.toLowerCase() > b.toLowerCase())
    )

    for folder in folders
        file = undefined
        try
            file = fs.readFileSync("#{folder}/kitnic.yaml")
        if file?
            info = yaml.safeLoad(file)
        else
            info = {}
        info = correctTypes(info)
        info.id = path.relative(boardDir, folder)
        if info.description == '' and /^github.com/.test(info.id)
            ghInfo = getGithubInfo(info.id)
            if ghInfo?.description?
                info.description = ghInfo.description
            else
                console.warn("WARNING: could not get GitHub description for #{folder}")
                console.warn(ghInfo)
        boards.push(info)

    boardJson = fs.openSync(targets[0], 'w')
    fs.write(boardJson, JSON.stringify(boards))
