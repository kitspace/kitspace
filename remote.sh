#!/usr/bin/env bash
# used for rsyncing to a build server, set KITNIC_BUILD_SERVER to an rsync
# accessible folder with this repo in it, use ./serve.sh on the server

if [ "$KITNIC_BUILD_SERVER" == "" ]; then
    echo "You need to set KITNIC_BUILD_SERVER";
    exit 1;
fi

function send() {
    rsync -r . $KITNIC_BUILD_SERVER --update --delete --progress \
        --exclude build --exclude node_modules --exclude .git;
}

send;

while inotifywait --exclude '\..*sw.' -r -q -e modify ./ src tasks; do
    send;
done
