# Data-Management

## initialize environment (once)

### create solr-core
- create solr-core

### initialze with osm-data
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


