import {GeoDocAdapterResponseMapper} from './gdoc-commons/services/gdoc-adapter-response.mapper';
import {GeoDocDataStore} from './gdoc-commons/services/gdoc-data.store';
import {GeoDocFileUtils} from './gdoc-commons/services/gdoc-file.utils';
import {GeoDocHttpAdapter} from './gdoc-commons/services/gdoc-http.adapter';
import {GeoDocItemsJsAdapter} from './gdoc-commons/services/gdoc-itemsjs.adapter';
import {GeoDocRoutingService} from './gdoc-commons/services/gdoc-routing.service';
import {GeoDocSearchService} from './gdoc-commons/services/gdoc-search.service';


// import untested service for code-coverage
for (const a in [
    GeoDocAdapterResponseMapper,
    GeoDocDataStore,
    GeoDocFileUtils,
    GeoDocHttpAdapter,
    GeoDocItemsJsAdapter,
    GeoDocRoutingService,
    GeoDocSearchService,
]) {
    console.log('import untested frontend-modules for codecoverage');
}
