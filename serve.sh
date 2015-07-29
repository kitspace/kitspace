#!/usr/bin/env sh
./configure.coffee && ninja -v && http-server build/ &
while true; do ninja | grep --invert-match 'ninja: no work to do.'; sleep 1; done;

