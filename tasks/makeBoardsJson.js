const yaml        = require('js-yaml');
const fs          = require('fs');
const path        = require('path');
const globule     = require('globule');
const utils       = require('./utils/utils');
const cp          = require('child_process');

const boardDir = 'boards';

if (require.main !== module) {

    exports.deps = [boardDir];
    exports.targets = ['build/.temp/boards.json'];
    exports.moduleDep = false;

} else {

    const getGithubInfo = function(id) {
        let text;
        const url =  `https://api.github.com/repos${id.replace(/^github.com/,'')}`;
        if (__guard__(__guard__(process, x1 => x1.env), x => x.GH_TOKEN) != null) { //we use this avoid being rate-limited
            text = cp.execSync(`curl -u kasbah:${process.env.GH_TOKEN} ${url}`);
        } else {
            console.warn('Using un-authenticated access to GitHub API');
            text = cp.execSync(`curl ${url}`);
        }
        return JSON.parse(text);
    };

    const correctTypes = function(boardInfo) {
        const boardInfoWithEmpty =
            { id : ''
            , summary : ''
            };
        for (let prop in boardInfoWithEmpty) {
            if (boardInfo.hasOwnProperty(prop)) {
                boardInfoWithEmpty[prop] = String(boardInfo[prop]);
            }
        }
        return boardInfoWithEmpty;
    };


    const {config, deps, targets} = utils.processArgs(process.argv);
    const boards = [];
    const folders = globule.find(`${boardDir}/*/*/*`, {filter: 'isDirectory'});
    folders.sort((a,b) => a.toLowerCase() > b.toLowerCase());

    for (let folder of folders) {
        var info;
        let file = undefined;
        try {
            file = fs.readFileSync(`${folder}/kitnic.yaml`);
        } catch (error) {}
        if (file != null) {
            info = yaml.safeLoad(file);
        } else {
            info = {};
        }
        info = correctTypes(info);
        info.id = path.relative(boardDir, folder);
        if (info.summary === '' && /^github.com/.test(info.id)) {
            const ghInfo = getGithubInfo(info.id);
            if (__guard__(ghInfo, x => x.description) != null) {
                info.summary = ghInfo.description;
            } else {
                console.warn(`WARNING: could not get GitHub description for ${folder}`);
                console.warn(ghInfo);
            }
        }
        boards.push(info);
    }

    const boardJson = fs.openSync(targets[0], 'w');
    fs.write(boardJson, JSON.stringify(boards));
}

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}