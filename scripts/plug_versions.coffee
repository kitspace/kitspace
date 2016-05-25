#!/usr/bin/env coffee
fs = require('fs')
utils = require('./utils')

repos = utils.readRepos()
registry = JSON.parse(fs.readFileSync('registry.json'))

for repo,index in repos
    hasVersion = registry.reduce (prev,{repo:r}) ->
        prev or (r == repo)
    , false
    if not hasVersion
        utils.getVersion repo, ((repo, index, hash) ->
            registry[index] = {repo, hash}
            fs.writeFile('./registry.json'
            , JSON.stringify(registry, undefined, 2))
        ).bind(undefined, repo, index)
