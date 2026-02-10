#!/usr/bin/env bash

cd ios
xcodebuild build-for-testing -workspace "AwardWallet.xcworkspace" -scheme "AwardWallet" -destination "platform=iOS Simulator,name=iPhone Xs Max,OS=12.2" -derivedDataPath "build"
cd -