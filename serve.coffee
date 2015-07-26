#!/usr/bin/env coffee
cp = require('child_process')
cp.spawnSync('http-server', ['build/'], {stdio:'inherit'})
