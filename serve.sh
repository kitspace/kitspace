#!/usr/bin/env sh
# this serves the build output and watches for changes to the source or tasks
# to rebuild

set -e

rm -f /tmp/ninja.lock

./configure.coffee && ninja -v && http-server build/ &

while inotifywait --exclude '\..*sw.' -r -q -e modify src tasks boards; do
    if [ ! -e "/tmp/ninja.lock" ]; then
        touch /tmp/ninja.lock; ninja && echo 'build succeeded'; rm /tmp/ninja.lock;
    fi
done

