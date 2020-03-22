import {GeoDocRecord, GeoDocRecordRelation} from '../model/records/gdoc-record';
import {GeoDocDataStore} from './gdoc-data.store';
import {GeoDocSearchService} from './gdoc-search.service';
import {GeoDocAdapterResponseMapper} from './gdoc-adapter-response.mapper';
import {ActionTagForm} from '@dps/mycms-commons/dist/commons/utils/actiontag.utils';
import {GeoDocSearchForm} from '../model/forms/gdoc-searchform';
import {GeoDocSearchResult} from '../model/container/gdoc-searchresult';
import {CommonDocDataService} from '@dps/mycms-commons/dist/search-commons/services/cdoc-data.service';
import {GeoDocRecordSchema} from "../model/schemas/gdoc-record-schema";

export class GeoDocDataService extends CommonDocDataService<GeoDocRecord, GeoDocSearchForm, GeoDocSearchResult> {
    public defaultLocIdParent = 1;

    constructor(dataStore: GeoDocDataStore) {
        super(dataStore, new GeoDocSearchService(dataStore), new GeoDocAdapterResponseMapper({}));
    }

    public createRecord(props, opts): GeoDocRecord {
        return <GeoDocRecord>this.dataStore.createRecord(this.getBaseMapperName(), props, opts);
    }

    protected addAdditionalActionTagForms(origGdocRecord: GeoDocRecord, newGdocRecord: GeoDocRecord,
                                          actionTagForms: ActionTagForm[]) {
    }

    protected defineDatastoreMapper(): void {
        this.dataStore.defineMapper('gdoc', GeoDocRecord, GeoDocRecordSchema, GeoDocRecordRelation);
    }

    protected defineIdMappingAlliases(): {} {
        return {
            'locIdParent': 'locId'
        };
    }

    protected defineIdMappings(): string[] {
        return ['locId', 'locIdParent', 'imageId'];
    }

    protected defineTypeMappings(): {} {
        return {
            location: 'locId'
        };
    }

    protected onImportRecordNewRecordProcessDefaults(record: GeoDocRecord): void {
        record.subtype = record.subtype ? record.subtype.replace(/[-a-zA-Z_]+/g, '') : '';
        if (record.type.toLowerCase() === 'location' && record.locIdParent === undefined
            && record.locId !== this.defaultLocIdParent) {
            record.locIdParent = this.defaultLocIdParent;
        }
    }
}
