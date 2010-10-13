#!/usr/bin/env bash

cd `dirname $0`

cd ..
foounit generate air
cd -


cd ../spec
foounit launch air
cd -

cd -
