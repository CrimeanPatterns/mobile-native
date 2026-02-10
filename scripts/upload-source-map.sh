#!/usr/bin/env bash

yarn react-native bundle \
    --platform "$1" \
    --dev false \
    --entry-file index.js \
    --bundle-output "$PWD/$1-release.bundle" \
    --sourcemap-output "$PWD/$1-release.bundle.map"

yarn bugsnag-source-maps upload-react-native  \
   --api-key=bed8e988e636321a80824b1c70662680 \
   --app-version="$2" \
   --platform="$1" \
   --source-map="$1-release.bundle.map" \
   --bundle="$1-release.bundle" \
   --project-root=$(PWD)

rm $(PWD)/$1-release.bundle $(PWD)/$1-release.bundle.map
