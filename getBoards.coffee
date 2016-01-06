#!/usr/bin/env coffee
fs = require('fs')
cp = require('child_process')
utils = require('./utils')

versions = JSON.parse(fs.readFileSync('versions.json'))

for {repo, hash} in versions
    folder = utils.repoToFolder(repo)
    fs.exists folder, ((folder, repo, hash, exists) ->
        if exists
            cmd = "cd #{folder} && git pull && git checkout #{hash}"
            console.log(cmd)
            cp.exec(cmd)
        else
            cmd = "git clone #{repo} #{folder} &&
                cd #{folder} && git checkout #{hash}"
            console.log(cmd)
            cp.exec(cmd)
    ).bind(undefined, folder, repo, hash)
