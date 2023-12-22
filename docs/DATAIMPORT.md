# Data-Management

## initialize environment (once)

### initialze with osm-data

#### Export POI-data on osm
- Infos
    - Tags https://wiki.openstreetmap.org/wiki/Tag:natural%3Dglacier
    - select https://overpass-turbo.eu/
- Samples
    - Sample: https://forum.openstreetmap.org/viewtopic.php?id=18927
    - Sample: https://wiki.openstreetmap.org/wiki/Overpass_API/Overpass_QL#Sets
    - Sample: https://observablehq.com/@easz/overpass-api-for-openstreetmap
- save exported data to F:/playground/mygeom-test/mygeombase/poi-import/poi_import.geojson
- select available tags [available osm-tags](https://taginfo.openstreetmap.org/tags/natural=peak#overview)
- get data export as geojson  [git via overpass-turbo](http://overpass-turbo.eu/#)
```
/*
This query looks for nodes, ways and relations 
with the given key/value combination.
Choose your region and hit the Run button above!
*/
[out:json][timeout:1125];
// gather results
(
  // query part for: “natural=peak”
  node["natural"="peak"]({{bbox}});
  way["natural"="peak"]({{bbox}});
  relation["natural"="peak"]({{bbox}});
);
// print results
out body;
>;
out skel qt;
```

#### Import poi-data into mygeom-database via admin-ui
- save exported data to F:/playground/mygeom-test/mygeombase/poi-import/poi_import.geojson
- start import-Job on admin-area: "POIIMPORT: importDataFromPoiDatabase"
    - will convert poi-import/poi_import.geojson -> poi_import-dump.json
    - will import (insert only not already found records) poi_import-dump.json and rename it afterwards

#### do it per scripts
- convert geojson files via windows cmd
```cmd
sbin\osm-geojson-convert.bat
```
- create viewer-files for directory-entries via bash
```bash
sbin/osm-geojson-generate-viewer.sh
```

#### do it manually
- convert geojson files via windows cmd
```cmd
OSMDIR=F:\playground\osm-poi-geojson
for %f in (%OSMDIR%\*.geojson) do (
    echo %~nf
    node dist\backend\serverAdmin.js ^
        --debug ^
        --command convertGeoDoc ^
        --action convertGeoJsonToGeoDoc ^
        --adminclibackend config/adminCli.dev.json ^
        --backend config/backend.dev.json ^
        --srcFile %OSMDIR%\%~nf.geojson ^
        --mode RESPONSE ^
        --file %OSMDIR%\%~nf.gdoc.json ^
        --renameFileIfExists true
)
```
- create viewer-files for directory-entries via bash
```bash
OSMDIR=F:/playground/osm-poi-geojson
FILTER=$OSMDIR/*.gdoc.json
FILES=`echo $FILTER | sed "s/ /,/g"`
echo $FILES
sbin/generateViewerFileForStaticData.sh $OSMDIR/ $FILES mygeom-pois

FILTER=$OSMDIR/import-alpen-*.gdoc.json
FILES=`echo $FILTER | sed "s/ /,/g"`
echo $FILES
sbin/generateViewerFileForStaticData.sh $OSMDIR/ $FILES mygeom-pois-alpen
${SCRIPTPATH}/setConfigValueInViewerFile.sh "${W_OSMDIR}\\mygeom-pois-alpen.html" "bestMatchingTabsOrder" '"POI", "INFO", "ALL"'
${SCRIPTPATH}/setConfigValueInViewerFile.sh "${W_OSMDIR}\\mygeom-pois-alpen.html" "favoritesTabsOrder" '"POI", "INFO", "ALL"'

FILTER=$OSMDIR/import-deutschland-*.gdoc.json
FILES=`echo $FILTER | sed "s/ /,/g"`
echo $FILES
sbin/generateViewerFileForStaticData.sh $OSMDIR/ $FILES mygeom-pois-deutschland
${SCRIPTPATH}/setConfigValueInViewerFile.sh "${W_OSMDIR}\\mygeom-pois-deutschland.html" "bestMatchingTabsOrder" '"POI", "INFO", "ALL"'
${SCRIPTPATH}/setConfigValueInViewerFile.sh "${W_OSMDIR}\\mygeom-pois-deutschland.html" "favoritesTabsOrder" '"POI", "INFO", "ALL"'

FILTER=$OSMDIR/import-sachsen-*.gdoc.json
FILES=`echo $FILTER | sed "s/ /,/g"`
echo $FILES
sbin/generateViewerFileForStaticData.sh $OSMDIR/ $FILES mygeom-pois-sachsen-peaks
${SCRIPTPATH}/setConfigValueInViewerFile.sh "${W_OSMDIR}\\mygeom-pois-sachsen-peaks.html" "bestMatchingTabsOrder" '"POI", "INFO", "ALL"'
${SCRIPTPATH}/setConfigValueInViewerFile.sh "${W_OSMDIR}\\mygeom-pois-sachsen-peaks.html" "favoritesTabsOrder" '"POI", "INFO", "ALL"'
```

### import into solr

#### create solr-core
- create solr-core

#### import files
- import files via windows cmd per script
```cmd
sbin\osm-geojson-import.bat
```
- OR import files via windows cmd manualy
```cmd
OSMDIR=F:\playground\osm-poi-geojson
for %f in (%OSMDIR%\*.gdoc.json) do (
    echo %~nf
    node dist\backend\serverAdmin.js ^
        --debug ^
        --command loadGeoDoc ^
        --action loadGeoDocs ^
        --adminclibackend config/adminCli.dev.json ^
        --backend config/backend.dev.json ^
        --file %OSMDIR%\%~nf.json ^
        --renameFileAfterSuccess true
)
```

#### do it via default-configured data 
- convert geojson to GeoDoc-json and import
```
f:
cd \projekte\mygeomanager
npm run backend-load-data
```
- OR do it manually
```
node dist\backend\serverAdmin.js --debug --command convertGeoDoc --action convertGeoJsonToGeoDoc --adminclibackend config/adminCli.dev.json --backend config/backend.dev.json --srcFile F:\playground\osm-poi-geojson\import-alpen-natural-peak.geojson --mode SOLR --file F:\playground\osm-poi-geojson\import-alpen-natural-peak.gdoc.json
node dist\backend\serverAdmin.js --debug --command convertGeoDoc --action convertGeoJsonToGeoDoc --adminclibackend config/adminCli.dev.json --backend config/backend.dev.json --srcFile F:\playground\osm-poi-geojson\import-alpen-natural-glacier.geojson --mode SOLR --file F:\playground\osm-poi-geojson\import-alpen-natural-glacier.gdoc.json
node dist\backend\serverAdmin.js --debug --command convertGeoDoc --action convertGeoJsonToGeoDoc --adminclibackend config/adminCli.dev.json --backend config/backend.dev.json --srcFile F:\playground\osm-poi-geojson\import-alpen-mountain_pass.geojson --mode SOLR --file F:\playground\osm-poi-geojson\import-alpen-mountain_pass.gdoc.json
node dist\backend\serverAdmin.js --debug --command loadGeoDoc --action loadGeoDocs --adminclibackend config/adminCli.dev.json --backend config/backend.dev.json --file F:\playground\osm-poi-geojson\import-alpen-natural-peak.gdoc.json
node dist\backend\serverAdmin.js --debug --command loadGeoDoc --action loadGeoDocs --adminclibackend config/adminCli.dev.json --backend config/backend.dev.json --file F:\playground\osm-poi-geojson\import-alpen-natural-glacier.gdoc.json
node dist\backend\serverAdmin.js --debug --command loadGeoDoc --action loadGeoDocs --adminclibackend config/adminCli.dev.json --backend config/backend.dev.json --file F:\playground\osm-poi-geojson\import-alpen-mountain_pass.gdoc.json
```

### configure local environments

### develop 
- configure a ```backend.json``` with another port and SqlMediadb
- configure ```src/frontend/environments/environment.ts``` to use this as backend-url 

### beta
- configure a second ```backend.beta.json``` with another port and Solr with ```http://localhost:8983/solr/mygeomdev``` as backend
- configure ```src/frontend/environments/environment.beta.ts``` to use this as backend-url 


