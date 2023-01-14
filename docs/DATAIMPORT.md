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
- save exported data to F:/playground/mytb-test/mytbbase/poi-import/poi_import.geojson
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

#### Import poi-data into mytb-database via admin-ui
- save exported data to F:/playground/mytb-test/mytbbase/poi-import/poi_import.geojson
- start import-Job on admin-area: "POIIMPORT: importDataFromPoiDatabase"
    - will convert poi-import/poi_import.geojson -> poi_import-dump.json
    - will import (insert only not already found records) poi_import-dump.json and rename it afterwards


#### prepare files
- convert geojson files via windows cmd
```cmd
for %f in (D:\docs\osm-poi-geojson\*.geojson) do (
    echo %~nf
    node dist\backend\serverAdmin.js ^
        --debug ^
        --command convertGeoDoc ^
        --action convertGeoJsonToGeoDoc ^
        --adminclibackend config/adminCli.dev.json ^
        --backend config/backend.dev.json ^
        --srcFile D:\docs\osm-poi-geojson\%~nf.geojson ^
        --mode RESPONSE ^
        --file D:\docs\osm-poi-geojson\%~nf.gdoc.json ^
        --renameFileIfExists true
)
```

### prepare a static viewer
- create viewer-files for directory-entries via bash
```bash
FILTER=D:/docs/osm-poi-geojson/*.gdoc.json
FILES=`echo $FILTER | sed "s/ /,/g"`
echo $FILES
sbin/generateViewerFileForStaticData.sh D:/docs/osm-poi-geojson/ $FILES mymm-pois
```

### import into solr

#### create solr-core
- create solr-core

#### import files
- import files via windows cmd
```cmd
for %f in (D:\docs\osm-poi-geojson\*.gdoc.json) do (
    echo %~nf
    node dist\backend\serverAdmin.js ^
        --debug ^
        --command loadGeoDoc ^
        --action loadDocs ^
        --adminclibackend config/adminCli.dev.json ^
        --backend config/backend.dev.json ^
        --file D:\docs\osm-poi-geojson\%~nf.gdoc.json ^
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
node dist\backend\serverAdmin.js --debug --command convertGeoDoc --action convertGeoJsonToGeoDoc --adminclibackend config/adminCli.dev.json --backend config/backend.dev.json --srcFile d:\docs\import-peaks-canaren.geojson --mode SOLR --file d:\docs\import-gdocs-peaks-canaren.json
node dist\backend\serverAdmin.js --debug --command convertGeoDoc --action convertGeoJsonToGeoDoc --adminclibackend config/adminCli.dev.json --backend config/backend.dev.json --srcFile d:\docs\import-alpine-huts.geojson --mode SOLR --file d:\docs\import-gdocs-alpine-huts.json
node dist\backend\serverAdmin.js --debug --command convertGeoDoc --action convertGeoJsonToGeoDoc --adminclibackend config/adminCli.dev.json --backend config/backend.dev.json --srcFile d:\docs\import-peaks-alpen.geojson --mode SOLR --file d:\docs\import-gdocs-peaks-alpen.json
node dist\backend\serverAdmin.js --debug --command loadGeoDoc --action loadGeoDocs --adminclibackend config/adminCli.dev.json --backend config/backend.dev.json --file d:\docs\import-gdocs-peaks-canaren.json
node dist\backend\serverAdmin.js --debug --command loadGeoDoc --action loadGeoDocs --adminclibackend config/adminCli.dev.json --backend config/backend.dev.json --file d:\docs\import-gdocs-alpine-huts.json
node dist\backend\serverAdmin.js --debug --command loadGeoDoc --action loadGeoDocs --adminclibackend config/adminCli.dev.json --backend config/backend.dev.json --file d:\docs\import-gdocs-peaks-alpen.json
```

### configure local environments

### develop 
- configure a ```backend.json``` with another port and SqlMediadb
- configure ```src/frontend/environments/environment.ts``` to use this as backend-url 

### beta
- configure a second ```backend.beta.json``` with another port and Solr with ```http://localhost:8983/solr/mygeomdev``` as backend
- configure ```src/frontend/environments/environment.beta.ts``` to use this as backend-url 


