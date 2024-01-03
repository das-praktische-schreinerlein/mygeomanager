#!/usr/bin/env bash

WORKSPACE="/cygdrive/f/Projekte/"
MYCMSPROJECT="mysimplehomepage"

echo "STEP: build frontend  -> there MUST NOT be the node_modules"
cd ${WORKSPACE}${MYCMSPROJECT}
npm run testCoverage || exit
npm run build-mdpad || exit
