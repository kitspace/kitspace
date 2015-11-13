#!/usr/bin/env sh
./configure.coffee && ninja -v && http-server build/ &
while inotifywait --exclude '\..*sw.' -r -q -e modify src; do
    ninja
done

