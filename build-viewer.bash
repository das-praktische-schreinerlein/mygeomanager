#!/usr/bin/env bash

WORKSPACE="/cygdrive/f/Projekte/"
MYCMSPROJECT="mygeomanager"

echo "STEP: build frontend  -> there MUST NOT be the node_modules"
cd ${WORKSPACE}${MYCMSPROJECT}
npm run testCoverage || exit
npm run build-viewer || exit
