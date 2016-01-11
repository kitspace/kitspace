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

modules = ['react', 'react-dom']

excludes = '-x ' + modules.join(' -x ')
requires = '-r ' + modules.join(' -r ')

browserify = "browserify --debug --extension='.jsx'
    --transform [babelify --presets [ react ] ]"

#browserify and put dependency list in $out.d in makefile format using
#relative paths
ninja.rule('browserify')
    .run("echo -n '$out: ' > $out.d
        && #{browserify} #{excludes} $in --list
            | sed 's!#{__dirname}/!!' | tr '\\n' ' ' >> $out.d
        && #{browserify} #{excludes} $in -o $out")
    .depfile('$out.d')
    .description("browserify $in -o $out")

ninja.rule('browserify-require')
    .run("echo -n '$out: ' > $out.d
        && #{browserify} #{requires} $in --list
            | grep ^#{__dirname} | sed 's!#{__dirname}/!!' | tr '\\n' ' ' >> $out.d
        && #{browserify} #{requires} $in -o $out")
    .depfile('$out.d')
    .description("browserify #{requires} -o $out")

ninja.edge('build/vendor.js').using('browserify-require')

images = globule.find('src/images/*')
for f in images
    ninja.edge(f.replace('src','build')).from(f).using('copy')

boardFolders = globule.find('boards/*/*/*', {filter:'isDirectory'})

jsSrc = globule.find(['src/*.js', 'src/*.jsx'])

jsMainTargets = jsSrc.map (f) ->
    temp = f.replace('src', 'build/.temp')
    ninja.edge(temp).from(f).using('copy')
    return temp

jsPageTargets = {}
for folder in boardFolders
    jsPageTargets[folder] = []
    jsSrc.map (f) ->
        temp = f.replace('src', "build/.temp/#{folder}")
        jsPageTargets[folder].push(temp)
        ninja.edge(temp).from(f).using('copy')

ninja.edge('build/app.js').from('build/.temp/render.jsx')
    .need('build/.temp/boards.json').using('browserify')

for folder in boardFolders
    ninja.edge("build/#{folder}/app.js")
        .need("build/.temp/#{folder}/info.json")
        .from("build/.temp/#{folder}/render_page.jsx")
        .using('browserify')

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
