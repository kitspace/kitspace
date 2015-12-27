#!/usr/bin/env bash

while read line; do
    if [ -e boards/$line ]; then
        echo "pulling boards/$line"
        cd boards/$line && git pull &
    else
        echo "cloning boards/$line"
        git clone --depth=1 "https://github.com/$line" "boards/$line" &
    fi
done < ./boards.txt
wait
