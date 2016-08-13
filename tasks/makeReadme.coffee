fs        = require('fs')
utils     = require('./utils/utils')
glob      = require('glob')
marky  = require('marky-markdown')
path      = require('path')
htmlToJsx = require('htmltojsx')

converter = new htmlToJsx({createClass:true, outputClassName: 'Readme'})

if require.main != module
    module.exports = (folder) ->
        pattern = "#{folder}/readme?(\.markdown|\.mdown|\.mkdn|\.md)"
        readmes = glob.sync(pattern, {nocase:true})
        deps = ["build/.temp/#{folder}/info.json"]
        if readmes.length > 0
            deps.push(readmes[0])
        targets = ["build/.temp/#{folder}/readme.jsx"]
        return {deps, targets, moduleDep: false}
else
    {deps, targets} = utils.processArgs(process.argv)
    readmeJsx = targets[0]
    html = ''
    info = require(__dirname + '/../' + deps[0])
    try readme = deps[1]
    if readme?
        pkg = {repository: {url: info.repo}}
        html = marky(fs.readFileSync(readme, 'utf8'), {prefixHeadingIds:false, package: pkg}).html()
    reactComponent = converter.convert("<div class='readme'>#{html}</div>")
    fs.writeFileSync(readmeJsx, "const React = require('react');\n" + reactComponent + "\nmodule.exports = Readme;\n")
