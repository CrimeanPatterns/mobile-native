#!/usr/bin/env bash

version=$1

let $# || { echo "First argument must be version (major.minor.patch)"; exit 1; } 

cd ios/
xcrun agvtool -noscm new-version -all "$version"
xcrun agvtool -noscm new-marketing-version "$version"
cd -