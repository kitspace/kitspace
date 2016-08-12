fs        = require('fs')
utils     = require('./utils/utils')
glob      = require('glob')
renderme  = require('renderme')
path      = require('path')
htmlToJsx = require('htmltojsx')

converter = new htmlToJsx({createClass:true, outputClassName: 'Readme'})

if require.main != module
    module.exports = (folder) ->
        pattern = "#{folder}/readme?(\.markdown|\.mdown|\.mkdn|\.md|\.textile|\
            \.rdoc|\.org|\.creole|\.mediawiki|\.wiki|\.rst|\.asciidoc|\.adoc|\
            \.asc|\.pod)"
        readmes = glob.sync(pattern, {nocase:true})
        deps = []
        if readmes.length > 0
            deps.push(readmes[0])
        targets = ["build/.temp/#{folder}/readme.jsx"]
        return {deps, targets, moduleDep: false}
else
    {deps, targets} = utils.processArgs(process.argv)
    readmeJsx = targets[0]
    try readme = deps[0]
    renderme
        readme: (try fs.readFileSync(readme, 'utf8')) || ''
        readmeFilename: (try path.basename(readme)) || ''
    , (err, html) ->
        reactComponent = converter.convert("<div class='readme'>#{html}</div>")
        fs.writeFileSync(readmeJsx, "const React = require('react');\n" + reactComponent + "\nmodule.exports = Readme;\n")
