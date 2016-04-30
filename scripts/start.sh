#!/usr/bin/env bash
# this serves the build output and watches for changes to the source or tasks
# to rebuild

# exit with non-zero code if anything fails
set -e

case "$OSTYPE" in
  solaris*) OS="SOLARIS" ;;
  darwin*)  OS="OSX" ;;
  linux*)   OS="LINUX" ;;
  bsd*)     OS="BSD" ;;
esac

build() {
    ./configure.coffee $1
    echo "ninja";
    ninja && echo '* build succeeded *' || echo 'BUILD FAILED';
}

http-server build/ &

build $1

if [ "$OS" == 'LINUX' ]; then
    while inotifywait --exclude '\..*sw.' -r -q -e modify src/ tasks/ boards/; do
      build $1
    done
elif [ "$OS" == 'OSX' ]; then
    while fswatch --one-event src/ tasks/ boards/; do
        build $1
    done
fi
