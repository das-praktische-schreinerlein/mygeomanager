import {GeoDocSearchResult} from '../shared/gdoc-commons/model/container/gdoc-searchresult';
import {GeoDocSearchForm, GeoDocSearchFormValidator} from '../shared/gdoc-commons/model/forms/gdoc-searchform';
import {GeoDocDataService} from '../shared/gdoc-commons/services/gdoc-data.service';
import express from 'express';
import {GeoDocRecord} from '../shared/gdoc-commons/model/records/gdoc-record';
import {DataCacheModule} from '@dps/mycms-server-commons/dist/server-commons/datacache.module';
import {CommonDocServerModule} from '@dps/mycms-server-commons/dist/backend-commons/modules/cdoc-server.module';
import {CommonDocSearchForm} from '@dps/mycms-commons/dist/search-commons/model/forms/cdoc-searchform';

export class GeoDocServerModule extends CommonDocServerModule<GeoDocRecord, GeoDocSearchForm, GeoDocSearchResult, GeoDocDataService> {
    public static configureRoutes(app: express.Application, apiPrefix: string, dataService: GeoDocDataService,
                                  cache: DataCacheModule, backendConfig: {}): GeoDocServerModule {
        const gdocServerModule = new GeoDocServerModule(dataService, cache);
        CommonDocServerModule.configureServerRoutes(app, apiPrefix, gdocServerModule, cache, backendConfig);
        return gdocServerModule;
    }

    public constructor(protected dataService: GeoDocDataService, protected cache: DataCacheModule) {
        super(dataService, cache);
    }

    getApiId(): string {
        return 'gdoc';
    }

    getApiResolveParameterName(): string {
        return 'resolveGdocByGdocId';
    }

    isSearchFormValid(searchForm: CommonDocSearchForm): boolean {
        return GeoDocSearchFormValidator.isValid(<GeoDocSearchForm>searchForm);
    }

}
