import {Injectable} from '@angular/core';
import {GeoDocSearchForm} from '../shared/gdoc-commons/model/forms/gdoc-searchform';
import {GeoDocSearchResult} from '../shared/gdoc-commons/model/container/gdoc-searchresult';
import {Facets} from '@dps/mycms-commons/dist/search-commons/model/container/facets';
import {GeoDocRecord} from '../shared/gdoc-commons/model/records/gdoc-record';

@Injectable()
export class GeoDocDataServiceStub {
    static defaultSearchResult(): GeoDocSearchResult {
        return new GeoDocSearchResult(
            new GeoDocSearchForm({}), 1, [ new GeoDocRecord({id: '1', name: 'Test'})], new Facets());
    }

    static defaultRecord(): GeoDocRecord {
        return new GeoDocRecord({id: '1', name: 'Test'});
    }

    cloneSanitizedSearchForm(values: GeoDocSearchForm): GeoDocSearchForm {
        return new GeoDocSearchForm(values);
    }

    newSearchForm(values: {}): GeoDocSearchForm {
        return new GeoDocSearchForm(values);
    }

    search(searchForm: GeoDocSearchForm): Promise<GeoDocSearchResult> {
        return Promise.resolve(new GeoDocSearchResult(searchForm, 0, [], new Facets()));
    };

    newSearchResult(gdocSearchForm: GeoDocSearchForm, recordCount: number,
                    currentRecords: GeoDocRecord[], facets: Facets): GeoDocSearchResult {
        return new GeoDocSearchResult(gdocSearchForm, recordCount, currentRecords, facets);
    }
}
