# Configure MyGeoManager

## Backend

### API-Server Config: config/backend.PROFILE.json
The configuration-file to configure the backend-api-server.

- server-port for backend-api
```json
{
    "port": 4100
}
```
- writable or readonly
```json
{
    "gdocWritable": true,
}
```
- datastore and specific connection-attributes
```json
{
    "gdocDataStoreAdapter": "GeoDocSolrAdapter",
    "GeoDocItemsJsAdapter": {
        "dataFile": "D:/tmp/test/mygeo.json"
    },
    "GeoDocSolrAdapter": {
        "solrCoreGeoDoc": "http://localhost:9999/solr/coremygeo/",
        "solrCoreGeoDocReadUsername": "mygeomread",
        "solrCoreGeoDocReadPassword": "SolrRocks"
    },
}
```
- IMPORTANT if you use an external solr you must remove the solrPasswordReset on startup in the config/adminCli.PROFILE.json !!!!!
```
    {
        "parameters": {
            "command": "initConfig",
            "action": "resetSolrPasswords",
            "solrconfigbasepath": "dist/contrib/solr/server/solr"
        }
    }
```

### Frontendserver: config/frontend.PROFILE.json
The configuration for the frontendserver.

- configure port and cachefolder
```json
{
    "port": 4002,
    "cacheFolder": "cache/"
} 
```

### Backend-Firewall: config/firewall.PROFILE.json
The configuration-file to configure the firewall for backend-api-server and frontend-server.

- if you habe a dns-blacklist-account
```json
{
    "dnsBLConfig": {
        "apiKey": "",
        "maxThreatScore": 20,
        "dnsttl": 3600000,
        "errttl": 60000,
        "timeout": 3000,
        "whitelistIps": ["::1", "127.0.0.1"],
        "cacheRedisUrl": "redis://localhost:6379/",
        "cacheRedisPass": "blablub",
        "cacheRedisDB": "1"
    }
}
```
- static blacklist to block spanner/spider...
```json
{
    "blackListIps": [
    ]
}
```

### API-Server Content: config/pdocs-de.json
Configure the content of the static section-pages.

- page-content
```json
{
 "pdocs": [
  {
   "id": "start",
   "descMd": "Willkommen bei MyGeoM.",
   "flgShowTopTen": true,
   "flgShowNews": true,
   "flgShowSearch": true,
   "heading": "Thats MyGeoM",
   "name": "Start",
   "subSectionIds": "schwerpunkt",
   "teaser": "Willkommen bei MyGeoM",
   "type": "SectionOverviewPage"
  }
  ]
}
```

### API-Server themefilter: config/themeFilterConfig.json
Configure the mapping of the section-page-ids to specifiv filters a "berge -> KW_Berge".

- mapping
```json
{ 
   "berge": { "keywords_txt": { "in": ["kw_berge"] } },
   "museum": { "keywords_txt": { "in": ["kw_museum", "kw_museumsbesuch"] } },
   "klettern": { "keywords_txt": { "in": ["kw_klettern", "kw_sachsenklettern", "kw_sportklettern", "kw_alpinklettern"] } }
}
```

### Admin-API-Server Config: config/adminServer.PROFILE.json
- port
```
    "port": 4900,
```
- the flag that admin is available and the available predefined admin-commands to execute via web
```
    "commandConfig": {
    "commandConfig": {
        "adminWritable": true,
        "preparedCommands": {
            "generateSitemap": {
                "description": "generate sitemaps",
                "commands": [
                    {
                        "parameters": {
                            "command": "generateSitemap",
                            "action": "generateSitemap",
                            "backend": "config/backend.dev.json",
                            "sitemap": "config/sitemap-de.json"
                        }
                    },
                    {
                        "parameters": {
                            "command": "generateSitemap",
                            "action": "generateSitemap",
                            "backend": "config/backend.dev.json",
                            "sitemap": "config/sitemap-en.json"
                        }
                    }
                ]
            }
        }
    }
```

### CLI Config: config/adminCli.PROFILE.json
- the flag that admin is available and the available admin-commands to execute via cli
```
    "adminWritable": true,
    "availableCommands": {
        "*": "*"
    },
    "preparedCommands": {
        "prepareAppEnv": {
            "description": "prepare app-environment (no actions required)",
            "commands": [
            ]
        }
    },
    "constantParameters": {
        "noOverrides": "use all parameters as put to commandline"
    }
```
- **IMPORTANT if you DON'T want to reset passwords -> remove such actions from config/adminCli.PROFILE.json !!!!!**
```
    {
        "parameters": {
            "command": "initConfig",
            "action": "resetSolrPasswords",
            "solrconfigbasepath": "dist/contrib/solr/server/solr"
        }
    }
```
- **IMPORTANT if you use an external solr you must remove the solrPasswordReset on startup in the config/adminCli.PROFILE.json !!!!!**
```
    {
        "parameters": {
            "command": "initConfig",
            "action": "resetSolrPasswords",
            "solrconfigbasepath": "dist/contrib/solr/server/solr"
        }
    }
```

## Frontend

### Build-Environment: src/frontend/environments/environment.*.ts

- connection-urls of the backend-api
```typescript
export const environment = {
    backendApiBaseUrl: 'http://localhost:4100/api/v1/'
};
```
- production and writable-flags
```typescript
export const environment = {
    production: false,
};
```
- tracking-provider
```typescript
export const environment = {
    trackingProviders: [Angulartics2Piwik]
};
```

### App-Config: src/frontend/assets/config.json

- keyword/person-structure
```json
{
    "components": {
    }
}
```

### Override some message-resources: src/frontend/assets/locales/locale-de-overrides.json 

- brandname and descriptions
```json
{
    "nav.brand.appName": "MyGeoManager",
    "meta.title.prefix.errorPage": "MyGeoManager - Oje ein Fehler",
    "meta.title.prefix.sectionPage": "MyGeoManager - {{title}}",
    "meta.title.prefix.cdocSearchPage": "MyGeoManager - Suche",
    "meta.title.prefix.cdocShowPage": "MyGeoManager - {{cdoc}}",
    "meta.title.prefix.cdocSectionSearchPage": "MyGeoManager - {{title}} - Suche",
    "meta.title.prefix.cdocSectionShowPage": "MyGeoManager - {{title}} - {{cdoc}}",
    "meta.desc.prefix.errorPage": "MyGeoManager - Oje ein Fehler ist aufgetreten",
    "meta.desc.prefix.sectionPage": "MyGeoManager - {{title}} - {{teaser}}",
    "meta.desc.prefix.cdocSearchPage": "MyGeoManager - Touren/Berichte/Regionen/Bilder/Infos",
    "meta.desc.prefix.cdocShowPage": "MyGeoManager - Infos für {{cdoc}}",
    "meta.desc.prefix.cdocSectionSearchPage": "MyGeoManager - Touren/Berichte/Regionen/Bilder/Infos zum Thema {{title}} - {{teaser}}",
    "meta.desc.prefix.cdocSectionShowPage": "MyGeoManager - {{title}} - Infos für {{cdoc}}",
```
