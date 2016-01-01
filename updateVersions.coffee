#!/usr/bin/env coffee
fs = require('fs')
utils = require('./utils')

repos = utils.readRepos()
versions = {}
n_repos = repos.length
for repo in repos
    utils.getVersion repo, ((repo, hash) ->
        versions[repo] = hash
        n_repos -= 1
        if n_repos == 0
            fs.writeFile('./versions.json', JSON.stringify(versions))
    ).bind(undefined, repo)

