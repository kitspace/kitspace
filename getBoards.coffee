#!/usr/bin/env coffee
fs = require('fs')
cp = require('child_process')
utils = require('./utils')

versions = JSON.parse(fs.readFileSync('versions.json'))

for {repo, hash} in versions
    folder = utils.repoToFolder(repo)
    fs.exists folder, ((folder, repo, hash, exists) ->
        if exists
            cmd = "cd #{folder} && git checkout #{hash}
                || git fetch --unshallow && git checkout #{hash}
                || git pull origin master && git checkout #{hash}"
            console.log(cmd)
            cp.exec cmd, (err, out)->
                if err?
                    console.error(err)
                    process.exit(err.code)
        else
            cmd = "git clone --depth=1 #{repo} #{folder}
                && cd #{folder} && git checkout #{hash}
                || git fetch --unshallow && git checkout #{hash}"
            console.log(cmd)
            cp.exec cmd, (err, out)->
                if err?
                    console.error(err)
                    process.exit(err.code)
    ).bind(undefined, folder, repo, hash)
