#!/usr/bin/env bash

cd ios

xcodebuild test-without-building -xctestrun "build/Build/Products/AwardWallet_iphonesimulator12.2-x86_64.xctestrun" -destination "platform=iOS Simulator,name=iPhone Xs Max,OS=12.2"
cd -