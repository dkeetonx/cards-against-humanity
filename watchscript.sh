#!/bin/bash
set -x

inotifywait --recursive --monitor --event modify,move,create,delete --format '%w%f' ./ \
    | while read line
do
    if [[ $line =~ ^\./watchscript ]]
    then
        continue
    fi

    if [[ $line =~ ^\./\. ]]
    then
        continue
    fi

    if [[ $line =~ ^\./storage/ ]]
    then
        continue
    fi

    if [[ $line =~ ^\./public/hot/ ]]
    then
        continue
    fi

    scp $line cards:staging/$line
done
