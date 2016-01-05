#!/usr/bin/env coffee
globule = require('globule')
path    = require('path')

ninjaBuildGen = require('./ninja-build-gen')

ninja = ninjaBuildGen('1.5.1', 'build/')

ninja.header("#generated from #{path.basename(module.filename)}")

ninja.rule('coffee').run('coffee -- $in -- $out')
    .description('$in')

ninja.rule('copy').run('cp $in $out')
    .description('$command')

ninja.rule('browserify').run("browserify
    --extension='.jsx'
    --debug -t [babelify --presets [ react ] ]
    $in -o $out"
).description('$command')

html = globule.find('src/*.html')
images = globule.find('src/images/*')
for f in html.concat(images)
    ninja.edge(f.replace('src','build')).from(f).using('copy')

js = globule.find('src/*.js').map (f) ->
    temp = f.replace('src', 'build/.temp')
    ninja.edge(temp).from(f).using('copy')
    return temp

jsx = globule.find('src/*.jsx').map (f) ->
    temp = f.replace('src', 'build/.temp')
    ninja.edge(temp).from(f).using('copy')
    return temp

ninja.edge('build/bundle.js').from('build/.temp/main.jsx')
    .need(js.concat(jsx.concat(['build/.temp/boards.json']))).using('browserify')

boardFolders = globule.find('boards/*/*/*', {filter:'isDirectory'})

for taskFile in globule.find('tasks/*.coffee')
    task = require("./#{path.dirname(taskFile)}/#{path.basename(taskFile)}")
    addEdge = (t) ->
        ninja.edge(t.targets)
            .from([taskFile].concat(t.deps))
            .using('coffee')
    if typeof task == 'function'
        for folder in boardFolders
            addEdge(task(folder))
    else
        addEdge(task)

ninja.rule('remove').run('rm -rf $in')
    .description('$command')

ninja.edge('clean').from('build/').using('remove')

all = ninja.edges.filter (c) ->
    'clean' not in c.targets
.reduce (prev, c) ->
    prev.concat(c.targets)
, []

ninja.edge('all').from(all)

ninja.byDefault('all')

ninja.save('build.ninja')

console.log('generated build.ninja')
