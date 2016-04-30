#!/usr/bin/env coffee
fs = require('fs')
utils = require('./utils')

repos = utils.readRepos()
versions = JSON.parse(fs.readFileSync('versions.json'))

for repo,index in repos
    hasVersion = versions.reduce (prev,{repo:r}) ->
        prev or (r == repo)
    , false
    if not hasVersion
        utils.getVersion repo, ((repo, index, hash) ->
            versions[index] = {repo, hash}
            fs.writeFile('./versions.json'
            , JSON.stringify(versions, undefined, 2))
        ).bind(undefined, repo, index)
