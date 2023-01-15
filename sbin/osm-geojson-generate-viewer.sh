#!/bin/bash
# exit on error
set -e
CWD=$(pwd)
SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

echo "now: configure linux vars: run sbin/configure-environment.sh"
source ${SCRIPTPATH}/configure-environment.bash

echo "run generate osm-viewer for dir: ${OSMDIR}"
FILTER=$OSMDIR/*.gdoc.json
FILES=`echo $FILTER | sed "s/ /,/g"`

echo "run generate osm-viewer for fiels: ${FILES}"
${SCRIPTPATH}/generateViewerFileForStaticData.sh ${OSMDIR}/ $FILES mygeom-pois
${SCRIPTPATH}/setConfigValueInViewerFile.sh "${W_OSMDIR}\\mygeom-pois.html" "bestMatchingTabsOrder" '"POI","INFO"'
${SCRIPTPATH}/setConfigValueInViewerFile.sh "${W_OSMDIR}\\mygeom-pois.html" "favoritesTabsOrder" '"POI"'

echo "done generate osm-viewer for fiels: ${FILES}"
