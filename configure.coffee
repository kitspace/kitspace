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

images = globule.find('src/images/*')
for f in images
    ninja.edge(f.replace('src','build')).from(f).using('copy')

boardFolders = globule.find('boards/*/*/*', {filter:'isDirectory'})

js = globule.find(['src/*.js', 'src/*.jsx']).map (f) ->
    temp = f.replace('src', 'build/.temp')
    ninja.edge(temp).from(f).using('copy')
    for folder in boardFolders
        t = f.replace('src', "build/.temp/#{folder}")
        ninja.edge(t).from(f).using('copy')
    return temp


ninja.edge('build/bundle.js').from('build/.temp/render.jsx')
    .need(js.concat('build/.temp/boards.json')).using('browserify')

for folder in boardFolders
    ninja.edge("build/#{folder}/bundle.js")
        .from("build/.temp/#{folder}/render_page.jsx").using('browserify')

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
