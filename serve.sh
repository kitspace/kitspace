#!/usr/bin/env sh
# this serves the build output and watches for changes to the source or tasks
# to rebuild

set -e

./configure.coffee && ninja -v && http-server build/ &

while inotifywait --exclude '\..*sw.' -r -q -e modify src tasks boards; do
    ninja && echo '* build succeeded *';
done
