import {GeoDocDataStore, GeoDocTeamFilterConfig} from '../shared/gdoc-commons/services/gdoc-data.store';
import {SearchParameterUtils} from '@dps/mycms-commons/dist/search-commons/services/searchparameter.utils';
import {GeoDocDataService} from '../shared/gdoc-commons/services/gdoc-data.service';
import {GeoDocSolrAdapter} from '../shared/gdoc-commons/services/gdoc-solr.adapter';
import axios from 'axios';
import * as fs from 'fs';
import {HttpAdapter} from 'js-data-http';
import {GeoDocItemsJsAdapter} from '../shared/gdoc-commons/services/gdoc-itemsjs.adapter';
import {GeoDocFileUtils} from '../shared/gdoc-commons/services/gdoc-file.utils';
import {
    ExtendedItemsJsConfig,
    ItemsJsDataImporter
} from '@dps/mycms-commons/dist/search-commons/services/itemsjs.dataimporter';

export class GeoDocDataServiceModule {
    private static dataServices = new Map<string, GeoDocDataService>();

    public static getDataService(profile: string, backendConfig: {}): GeoDocDataService {
        if (!this.dataServices.has(profile)) {
            switch (backendConfig['gdocDataStoreAdapter']) {
                case 'GeoDocSolrAdapter':
                    this.dataServices.set(profile, GeoDocDataServiceModule.createDataServiceSolr(backendConfig));
                    break;
                case 'GeoDocItemsJsAdapter':
                    this.dataServices.set(profile, GeoDocDataServiceModule.createDataServiceItemsJs(backendConfig));
                    break;
                default:
                    throw new Error('configured gdocDataStoreAdapter not exist:' + backendConfig['gdocDataStoreAdapter']);
            }
        }

        return this.dataServices.get(profile);
    }

    private static createDataServiceSolr(backendConfig: {}): GeoDocDataService {
        // configure store
        const filterConfig: GeoDocTeamFilterConfig = new GeoDocTeamFilterConfig();
        const themeFilters: any[] = JSON.parse(fs.readFileSync(backendConfig['filePathThemeFilterJson'], { encoding: 'utf8' }));
        for (const themeName in themeFilters) {
            filterConfig.set(themeName, themeFilters[themeName]);
        }
        const dataStore: GeoDocDataStore = new GeoDocDataStore(new SearchParameterUtils(), filterConfig);
        const dataService: GeoDocDataService = new GeoDocDataService(dataStore);

        // configure solr-adapter
        const solrConfig = backendConfig['GeoDocSolrAdapter'];
        if (solrConfig === undefined) {
            throw new Error('config for GeoDocSolrAdapter not exists');
        }
        const options = {
            basePath: solrConfig['solrCoreGeoDoc'],
            suffix: '&wt=json&indent=on&datatype=jsonp&json.wrf=JSONP_CALLBACK&callback=JSONP_CALLBACK&',
            http: axios,
            beforeHTTP: function (config, opts) {
                config.auth = {
                    username: solrConfig['solrCoreGeoDocReadUsername'],
                    password: solrConfig['solrCoreGeoDocReadPassword']
                };

                // Now do the default behavior
                return HttpAdapter.prototype.beforeHTTP.call(this, config, opts);
            },
            mapperConfig: backendConfig['mapperConfig']
        };
        const adapter = new GeoDocSolrAdapter(options);
        dataStore.setAdapter('http', adapter, '', {});

        return dataService;
    }

    private static createDataServiceItemsJs(backendConfig: {}): GeoDocDataService {
        // configure store
        const filterConfig: GeoDocTeamFilterConfig = new GeoDocTeamFilterConfig();
        const themeFilters: any[] = JSON.parse(fs.readFileSync(backendConfig['filePathThemeFilterJson'], { encoding: 'utf8' }));
        for (const themeName in themeFilters) {
            filterConfig.set(themeName, themeFilters[themeName]);
        }
        const dataStore: GeoDocDataStore = new GeoDocDataStore(new SearchParameterUtils(), filterConfig);
        const dataService: GeoDocDataService = new GeoDocDataService(dataStore);

        // configure adapter
        const options = { skipMediaCheck: false};
        const itemsJsConfig: ExtendedItemsJsConfig = GeoDocItemsJsAdapter.itemsJsConfig;
        ItemsJsDataImporter.prepareConfiguration(itemsJsConfig);
        if (itemsJsConfig === undefined) {
            throw new Error('config for GeoDocItemsJsAdapter not exists');
        }
        const records = GeoDocFileUtils.parseRecordSourceFromJson(fs.readFileSync(itemsJsConfig['dataFile'], { encoding: 'utf8' }));

        const gdocAdapter = new GeoDocItemsJsAdapter(options, records, itemsJsConfig);
        dataStore.setAdapter('http', gdocAdapter, '', {});

        return dataService;
    }
}
