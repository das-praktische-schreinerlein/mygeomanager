# Install MyGeoManager

## prepare

### prepare build-scripts
- build-dev.bash, build-beta.bash, build-prod.bash
```bash
#!/usr/bin/env bash

WORKSPACE="/cygdrive/f/Projekte/"
MYCMSPROJECT="mygeomanager"
```

### prepare src-directory
```bash
npm prune && npm install
``` 

## Build dev
Run for the dev-versions in `dist/`.
```bash
bash
./build-dev.bash
```

## Build beta
Run for the beta-versions in `dist/`.
```bash
bash
./build-beta.bash
```

## Build prod
Run for the prod-versions in `dist/`. 
```bash
bash
./build-prod.bash
```

## Deploy prod
Stop backend via startscript
```bash
/etc/init.d/mygeom start
/etc/init.d/mygeom-frontend start
```

Copy startscript `installer/linux/init.d/mygeom*` to `/etc/init.d/` and change paths.

Copy files to server
```
package.json
dist
config
error_docs
```

Copy files on server to `$APPDIR`
```bash
cd $APPDIR
rm -fr dist
mv $IMPORTDIR/dist $APPDIR

rm -fr config
mv $IMPORTDIR/config $APPDIR

rm -fr error_docs
mv $IMPORTDIR/error_docs $APPDIR

rm -fr package.json 
mv $IMPORTDIR/package.json $APPDIR
```

Install packages
```bash
cd $APPDIR
npm install 
```

Set permissions and rights für `$APPDIR`

Start backend via startscript
```bash
/etc/init.d/mygeom start
/etc/init.d/mygeom start-frontend
```
