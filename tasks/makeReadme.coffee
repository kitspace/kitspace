fs        = require('fs')
utils     = require('./utils/utils')
glob      = require('glob')
marky  = require('marky-markdown')
path      = require('path')
htmlToJsx = require('htmltojsx')

converter = new htmlToJsx({createClass:true, outputClassName: 'Readme'})

if require.main != module
    module.exports = (folder) ->
        pattern = "#{folder}/readme?(\.markdown|\.mdown|\.mkdn|\.md"
        readmes = glob.sync(pattern, {nocase:true})
        deps = []
        if readmes.length > 0
            deps.push(readmes[0])
        targets = ["build/.temp/#{folder}/readme.jsx"]
        return {deps, targets, moduleDep: false}
else
    {deps, targets} = utils.processArgs(process.argv)
    readmeJsx = targets[0]
    html = ''
    try readme = deps[0]
    if readme?
        html = marky(fs.readFileSync(readme, 'utf8')).html()
    reactComponent = converter.convert("<div class='readme'>#{html}</div>")
    fs.writeFileSync(readmeJsx, "const React = require('react');\n" + reactComponent + "\nmodule.exports = Readme;\n")
