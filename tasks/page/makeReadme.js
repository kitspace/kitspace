const fs        = require('fs');
const utils     = require('../utils/utils');
const glob      = require('glob');
const marky     = require('marky-markdown');
const path      = require('path');
const htmlToJsx = require('htmltojsx');

const converter = new htmlToJsx({createClass:true, outputClassName: 'Readme'});

if (require.main !== module) {
    module.exports = function(config, folder) {
        const pattern = `${folder}/readme?(\.markdown|\.mdown|\.mkdn|\.md)`;
        const readmes = glob.sync(pattern, {nocase:true});
        const deps = [`build/.temp/${folder}/info.json`];
        if (readmes.length > 0) {
            deps.push(readmes[0]);
        }
        const targets = [`build/.temp/${folder}/readme.jsx`];
        return {deps, targets, moduleDep: false};
    };
} else {
    let readme;
    const {deps, targets} = utils.processArgs(process.argv);
    const readmeJsx = targets[0];
    let html = '';
    const info = require(__dirname + '/../../' + deps[0]);
    try { readme = deps[1]; } catch (error) {}
    if (readme != null) {
        const pkg = {repository: {url: info.repo}};
        html = marky(fs.readFileSync(readme, 'utf8'), {package: pkg}).html();
    }
    const reactComponent = converter.convert(`<div class='readme'>${html}</div>`);
    fs.writeFileSync(readmeJsx, `const React = require('react');\n${reactComponent}\nmodule.exports = Readme;\n`);
}
