#!/usr/bin/env sh
rm -f /tmp/ninja.lock
./configure.coffee && ninja -v && http-server build/ &
while inotifywait --exclude '\..*sw.' -r -q -e modify src tasks boards; do
    if [ ! -e "/tmp/ninja.lock" ]; then
        touch /tmp/ninja.lock; ninja; rm /tmp/ninja.lock;
    fi
done

