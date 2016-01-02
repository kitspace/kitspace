#!/usr/bin/env coffee
fs = require('fs')
utils = require('./utils')

repos = utils.readRepos()
versions = JSON.parse(fs.readFileSync('versions.json'))

for repo in repos
    if repo not of versions
        utils.getVersion repo, ((repo, hash) ->
            versions[repo] = hash
            fs.writeFile('./versions.json', JSON.stringify(versions, undefined, 2))
        ).bind(undefined, repo)
