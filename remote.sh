#!/usr/bin/env bash
# used for rsyncing to a build server, set KITNIC_BUILD_SERVER to an rsync
# accessible folder with this repo in it, use ./serve.sh on the server

if [ "$KITNIC_BUILD_SERVER" == "" ]; then
    echo "You need to set KITNIC_BUILD_SERVER";
    exit 1;
fi

case "$OSTYPE" in
  solaris*) OS="SOLARIS" ;;
  darwin*)  OS="OSX" ;;
  linux*)   OS="LINUX" ;;
  bsd*)     OS="BSD" ;;
esac

function send() {
    rsync -r . $KITNIC_BUILD_SERVER --update --delete --progress \
        --exclude='build' --exclude='node_modules' --exclude='.git' \
        --exclude='.sass-cache' --exclude='.*.sw*';
}

send;

if [ "$OS" == 'LINUX' ]; then
    while inotifywait --exclude '\..*sw.' -r -q -e modify ./; do
        send;
    done
elif [ "$OS" == 'OSX' ]; then
    while fswatch --one-event src/ tasks/ boards/; do
        send;
    done
fi
