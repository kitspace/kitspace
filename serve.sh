#!/usr/bin/env sh
./configure.coffee && ninja && http-server build/
