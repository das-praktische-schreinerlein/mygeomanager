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

### prepare solr

#### install-solr
- run install script
```
npm install 
npm run install-solr
```

### install redis
- make redis
```bash
wget http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
cd redis-stable
make
make install
```
- dirs
```bash
mkdir /etc/redis/
mkdir /var/redis/
mkdir /var/redis/6379
```
- configure redis
```bash
cp redis.conf /etc/redis/6379.conf
vi /etc/redis/6379.conf

# accept only from localhost
bind 127.0.0.1
protected-mode yes

# set password-auth
requirepass blablum

# Set daemonize to yes (by default it is set to no).
daemonize yes

# Set the pidfile to /var/run/redis_6379.pid (modify the port if needed).
pidfile /var/run/redis_6379.pid

# Set your preferred loglevel.
loglevel notice

# Set the logfile to /var/log/redis_6379.log
logfile /var/log/redis_6379.log

# Set the dir to /var/redis/6379 (very important step!)
dir /var/redis/6379

# dont stop on write-errors
stop-writes-on-bgsave-error no
```
- startscript
```bash
cp utils/redis_init_script /etc/init.d/redis_6379
sudo update-rc.d redis_6379 defaults
```

## Build dev
Run for the dev-versions in `dist/`.
```bash
bash
./build-dev.bash
```

## Run scripts to initially reset database-passwords...
```bash
npm run backend-prepare-appenv-beforebuild
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
package-dist.json
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
mv $IMPORTDIR/package-dist.json $APPDIR/package.json
```

Install packages
```bash
cd $APPDIR
npm install 
```

On first install - Run scripts to initially reset passwords per environment
```bash
npm run backend-prepare-appenv-afterinstall-dev
npm run backend-prepare-appenv-afterinstall-beta
npm run backend-prepare-appenv-afterinstall-prod
```

On update - Run scripts to reset passwords per environment
```bash
npm run backend-prepare-appenv-afterupdate-dev
npm run backend-prepare-appenv-afterupdate-beta
npm run backend-prepare-appenv-afterupdate-prod
```

Set permissions and rights für `$APPDIR`

Start backend via startscript
```bash
/etc/init.d/mygeom start
/etc/init.d/mygeom start-frontend
```
