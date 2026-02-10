#!/usr/bin/env bash

find ./node_modules -type f -name '*.podspec' | xargs sed -i.sed -e 's%s.dependency[\t ]*"React"%s.dependency "React-Core"%g'
