#!/usr/bin/env bash

platform=$1
snapshotDir="__snapshots_${platform}__"

echo "rename $snapshotDir to __snapshots__"
find __tests__ -type d -name "$snapshotDir" -print0 | xargs -0 -I "{}" mv "{}" "{}/../__snapshots__"

echo "run tests"
jest --config "jest.${platform}.json" ${@:2}

echo "rename __snapshots__ to $snapshotDir"
find __tests__ -type d -name "__snapshots__" -print0 | xargs -0 -I "{}" mv "{}" "{}/../$snapshotDir"