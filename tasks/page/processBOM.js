const fs          = require('fs');
const globule     = require('globule');
const path        = require('path');
const yaml        = require('js-yaml');
const utils       = require('../utils/utils');
const oneClickBOM = require('1-click-bom');
const cp = require('child_process');

if (require.main !== module) {
    module.exports = function(config, folder) {
        let bom, file, info;
        try {
            file = fs.readFileSync(`${folder}/kitnic.yaml`);
        } catch (error) {}
        if (file != null) {
            info = yaml.safeLoad(file);
        }
        if (__guard__(info, x => x.bom) != null) {
            bom = folder + '/' + info.bom;
        } else {
            bom = folder + '/1-click-bom.tsv';
        }
        const deps = ['build/.temp/boards.json', folder, bom];
        const targets = [`build/.temp/${folder}/info.json`, `build/${folder}/1-click-BOM.tsv`];
        return {deps, targets, moduleDep : false};
    };
} else {
    let file, kitnicYaml;
    const {deps, targets} = utils.processArgs(process.argv);
    const [boardsJSON, folder, bomPath] = deps;
    const [infoPath, outBomPath] = targets;

    const boards = JSON.parse(fs.readFileSync(boardsJSON));
    const info = {id:folder.replace('boards/','')};

    info.summary = boards.reduce(function(prev, obj) {
        if (obj.id === info.id) {
            return obj.summary;
        } else {
            return prev;
        }
    }
    , '');

    try {
        file = fs.readFileSync(`${folder}/kitnic.yaml`);
    } catch (error) {}
    if (file != null) {
        kitnicYaml = yaml.safeLoad(file);
    }
    info.site = (__guard__(kitnicYaml, x => x.site) != null) ? kitnicYaml.site : '';

    const tsv = fs.readFileSync(bomPath, {encoding:'utf8'});
    const bom = oneClickBOM.parseTSV(tsv);
    info.bom = {lines: bom.lines};
    info.bom.tsv = oneClickBOM.writeTSV(bom.lines);

    let repo = cp.execSync(`cd ${folder} && git remote -v`, {encoding:'utf8'});
    repo = repo.split('\t')[1].split(' ')[0];
    info.repo = repo;

    fs.writeFile(infoPath, JSON.stringify(info), function() {});

    fs.writeFile(outBomPath, info.bom.tsv, function() {});
}

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}
