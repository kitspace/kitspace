#!/usr/bin/env coffee
fs      = require('fs')
globule = require('globule')
path    = require('path')

ninjaBuildGen = require('ninja-build-gen')

ninja = ninjaBuildGen('1.3', 'build/')

ninja.rule('coffee').run('coffee $in')
    .description('$in')

for taskFile in globule.find('tasks/*.coffee')
    task = require("./#{path.dirname(taskFile)}/#{path.basename(taskFile)}")
    ninja.edge(task.targets)
        .from([taskFile].concat(task.deps))
        .using('coffee')

ninja.save('build.ninja')

console.log('generated build.ninja')
