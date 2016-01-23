utils = require('./utils/utils')

if require.main != module
    module.exports = (folder) ->
        deps = [
            "build/.temp/#{folder}/Page.jsx"
            'src/index.html'
            "build/.temp/#{folder}/info.json"
            "build/.temp/#{folder}/zip-info.json"
        ]
        targets = ["build/#{folder}/index.html"]
        return {deps, targets, moduleDep: true}

else

    {deps, targets} = utils.processArgs(process.argv)
    utils.reactRender(deps[0], deps[1], targets[0])
