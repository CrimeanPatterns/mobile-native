#!/bin/sh

CHANGED=`git diff HEAD@{1} --stat -- yarn.lock | wc -l`
if [ $CHANGED -gt 0 ];
then
    yarn run snyk auth 07adaf5d-caf7-44ee-9602-6f8030b25d38
    yarn run snyk test
fi
