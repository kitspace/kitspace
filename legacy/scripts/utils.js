const fs = require('fs');
const cp = require('child_process');

const getVersion = function(repo, callback) {
    const id = setTimeout((function(repo) {
        console.error(`timed out to get version for ${repo}`);
        return process.exit(2);
    }).bind(undefined, repo)
    , 10000);
    return cp.exec(`git ls-remote ${repo}`, {encoding:'utf8'}, (function(repo, id, err, output) {
        clearTimeout(id);
        const hash = output.split('\n')[0].split('\t')[0];
        if ((hash == null) || hash === '') {
            console.error(`could not get version for ${repo}`);
            process.exit(1);
        }
        return callback(hash);
    }).bind(undefined, repo, id)
    );
};


const repoToFolder = function(repo) {
    let folder = repo.replace(/^http:\/\//,'');
    folder = folder.replace(/^https:\/\//,'');
    folder = folder.replace(/^.+?@/,'');
    return `boards/${folder}`;
};


const readRepos = function() {
    const repos = fs.readFileSync('./boards.txt', {encoding:'utf8'}).split('\n')
        .filter(l => l !== '');
    repos.reduce(function(prev, repo) {
        const folder = repoToFolder(repo);
        if (prev.includes(folder)) {
            console.error(`duplicate folder output for boards.txt: ${folder}`);
            return process.exit(1);
        } else {
            prev.push(folder);
            return prev;
        }
    }
    , []);
    return repos;
};


exports.getVersion   = getVersion;
exports.readRepos    = readRepos;
exports.repoToFolder = repoToFolder;
