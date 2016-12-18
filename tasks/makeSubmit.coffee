fs    = require('fs')
utils = require('./utils/utils')

if require.main != module
    module.exports = (folder, config) ->
        targets = ['build/submit/index.html']
        if config == 'production'
            deps = ['build/.temp/submit.jsx', 'src/submit.html']
            return {deps, targets, moduleDep: true}
        else if config == 'dev'
            deps = ['src/submit.html']
            return {deps, targets, moduleDep: false}


    exports.moduleDep = true

else
    {config, deps, targets} = utils.processArgs(process.argv)
    index = targets[0]
    if config == 'production'
        #do server-side rendering
        jsx = deps[0]
        html = deps[1]
        utils.reactRender(jsx, html, index)
    else if config == 'dev'
        #just copy the submit.html to index.html
        html = deps[0]
        fs.createReadStream(html).pipe(fs.createWriteStream(index))

