# Develop MyGeoManager

## prepare

### prepare build-scripts
- build-dev.bash, build-beta.bash, build-prod.bash
```bash
#!/usr/bin/env bash

WORKSPACE="/cygdrive/f/Projekte/"
MYCMSPROJECT="mygeomanager"
```

## Development server
Run initially to copy overrides into project
```bash
bash
npm prune && npm install && ./build-dev.bash
```

Run scripts to initially reset database-passwords... 
```bash
npm run backend-prepare-appenv-beforebuild
```

Run to build and start the backend. Navigate to [api](http://localhost:4100/api/v1/de/pdoc/) to get the pdocs.
```bash
npm run backend-build-and-serve-dev
```

Run for a dev server. Navigate to [startpage](http://localhost:4200/).
```bash
npm start
```

## Running unit tests
Run to execute the unit tests via [Karma](https://karma-runner.github.io).
```bash
npm test
```

## Running end-to-end tests
Run to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `npm start`.
```bash
npm e2e
```
