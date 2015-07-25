#!/usr/bin/env coffee
fs   = require('fs')
glob = require('glob')

ninjaBuildGen = require('ninja-build-gen')

ninja = ninjaBuildGen('1.3', 'build/')

ninja.rule('coffee').run('coffee $in')
    .description('$in')

for taskFile in glob.sync('tasks/*.coffee')
    task = require('./' + taskFile.substr(0,taskFile.search('.coffee')))
    ninja.edge(task.targets())
        .from([taskFile].concat(task.deps()))
        .using('coffee')

ninja.save('build.ninja')

console.log('generated build.ninja')
