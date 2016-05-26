#!/usr/bin/env coffee
fs = require('fs')
utils = require('./utils')

repos = utils.readRepos()
registry = []
n_repos = repos.length
for repo,index in repos
    utils.getVersion repo, ((repo, index, hash) ->
        registry[index] = {repo, hash}
        n_repos -= 1
        if n_repos == 0
            fs.writeFile('./registry.json', JSON.stringify(registry, undefined, 2))
    ).bind(undefined, repo, index)

