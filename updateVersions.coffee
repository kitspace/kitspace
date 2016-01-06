#!/usr/bin/env coffee
fs = require('fs')
utils = require('./utils')

repos = utils.readRepos()
versions = []
n_repos = repos.length
for repo,index in repos
    utils.getVersion repo, ((repo, index, hash) ->
        versions[index] = {repo, hash}
        n_repos -= 1
        if n_repos == 0
            fs.writeFile('./versions.json', JSON.stringify(versions, undefined, 2))
    ).bind(undefined, repo, index)

