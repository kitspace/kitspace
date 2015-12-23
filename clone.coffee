#!/usr/bin/env coffee
cp   = require('child_process')
fs   = require 'fs'
yaml = require('js-yaml')

boardList = yaml.safeLoad(fs.readFileSync('boards.yaml'))
gitRepos = boardList.map((b) -> "git@github.com:#{b}")
boardFolders = boardList.map((b) -> "boards/#{b}")

for _,i in boardList
    cmd = "git clone #{gitRepos[i]} #{boardFolders[i]}"
    console.log(cmd)
    cp.exec(cmd)
