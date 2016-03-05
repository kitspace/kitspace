#!/usr/bin/env coffee
#turn a list of files into depfile in makefile format
fs = require('fs')

target = process.argv[2]
filePath = process.argv[3]

deps = fs.readFileSync(filePath, 'utf8')

relativeDeps = []
for dep in deps.split('\n')
    relativeDeps.push(dep.replace(__dirname + '/', ''))

out = target + ': ' + relativeDeps.join(' ')

fs.writeFileSync(filePath, out)
