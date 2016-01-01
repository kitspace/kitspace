#!/usr/bin/env coffee
fs = require('fs')
cp = require('child_process')
utils = require('./utils')

versions = JSON.parse(fs.readFileSync('versions.json'))

for repo, hash of versions
    folder = utils.repoToFolder(repo)
    fs.exists folder, ((folder, repo, hash, exists) ->
        if exists
            cp.exec("cd #{folder} && git pull && git checkout #{hash}")
        else
            cp.exec("git clone #{repo} #{folder} &&
                cd #{folder} && git checkout #{hash}")
    ).bind(undefined, folder, repo, hash)
