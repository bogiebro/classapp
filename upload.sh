#!/bin/bash
rm -rf build
eval $(cat publicvars) ./node_modules/.bin/brunch build --production
eval $(cat publicvars) find build -type f | grep -v 'map' | eval $(cat publicvars .env) ./node_modules/.bin/lsc s3upload.ls
