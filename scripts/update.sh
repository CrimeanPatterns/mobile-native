#!/usr/bin/env bash

echo "Install modules"
ssh-add
yarn

if [ $1 = "ios" ]; then
    bundle exec pod install --project-directory=ios
fi

echo "Complete."
