fs    = require('fs')
utils = require('./utils/utils')

if require.main != module
    module.exports = (folder, config) ->
        targets = ["build/#{folder}/index.html"]
        if config == 'production'
            deps = [
                "build/.temp/#{folder}/page.jsx"
                'src/page.html'
                "build/.temp/#{folder}/info.json"
                "build/.temp/#{folder}/zip-info.json"
            ]
            return {deps, targets, moduleDep: true}
        else if config == 'dev'
            deps = ['src/page.html']
            targets = ["build/#{folder}/index.html"]
            return {deps, targets, moduleDep: false}

else
    {config, deps, targets} = utils.processArgs(process.argv)
    index = targets[0]
    if config == 'production'
        #do server-side rendering
        jsx = deps[0]
        html = deps[1]
        utils.reactRender(jsx, html, index)
    else if config == 'dev'
        #just copy the page.html to index.html
        html = deps[0]
        fs.createReadStream(html).pipe(fs.createWriteStream(index))
