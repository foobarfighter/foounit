#!/usr/bin/env bash

cd `dirname $0`

cd ..
foounit generate foo -t node
cd -


cd ../spec
foounit launch node
cd -

cd -
