import {GeoDocRecord} from '../model/records/gdoc-record';
import {GeoDocSearchForm} from '../model/forms/gdoc-searchform';
import {GeoDocSearchResult} from '../model/container/gdoc-searchresult';
import {GeoDocAdapterResponseMapper} from './gdoc-adapter-response.mapper';
import {ItemsJsConfig} from '@dps/mycms-commons/dist/search-commons/services/itemsjs-query.builder';
import {GenericItemsJsAdapter} from '@dps/mycms-commons/dist/search-commons/services/generic-itemsjs.adapter';
import {ExtendedItemsJsConfig} from '@dps/mycms-commons/dist/search-commons/services/itemsjs.dataimporter';

export class GeoDocItemsJsAdapter extends GenericItemsJsAdapter<GeoDocRecord, GeoDocSearchForm, GeoDocSearchResult> {
    public static itemsJsConfig: ExtendedItemsJsConfig = {
        skipMediaCheck: false,
        aggregationFields: ['id', 'loc_id_i'],
        refConfigs: [],
        spatialField: 'geo_loc_p',
        spatialSortKey: 'distance',
        searchableFields: ['id', 'loc_id_i',
            'dateshow_dt', 'desc_txt', 'desc_md_txt', 'desc_html_txt', 'geo_lon_s', 'geo_lat_s',
            'geo_ele_s', 'geo_ele_f', 'geo_loc_p',
            'gpstracks_basefile_s', 'keywords_txt', 'loc_lochirarchie_s', 'loc_lochirarchie_ids_s', 'name_s', 'type_s',
            'playlists_txt', 'subtype_ss', 'subtype_s'],
        aggregations: {
            'keywords_txt': {
                filterFunction: function(record) {
                    return record['keywords_txt']
                        ? record['keywords_txt'].replace(',,', ',').split(',')
                        : undefined
                },
                conjunction: false,
                sort: 'term',
                order: 'asc',
                hide_zero_doc_count: true,
                size: 1000
            },
            'loc_lochirarchie_txt': {
                conjunction: false,
                sort: 'term',
                order: 'asc',
                hide_zero_doc_count: true,
                size: 1000
            },
            'subtype_ss': {
                mapField: 'subtype_s',
                conjunction: false,
                sort: 'term',
                order: 'asc',
                hide_zero_doc_count: true,
                size: 1000
            },
            'type_txt': {
                mapField: 'type_s',
                conjunction: false,
                sort: 'term',
                order: 'asc',
                hide_zero_doc_count: false,
                size: 1000
            },
            'id': {
                conjunction: false,
                sort: 'term',
                order: 'asc',
                hide_zero_doc_count: true,
                size: 1000
            },
            'UNDEFINED_FILTER': {
                mapField: 'id',
                field: 'id',
                conjunction: true,
                sort: 'term',
                order: 'asc',
                hide_zero_doc_count: true,
                size: 1000
            }
       },
        sortings: {
            'date': {
                field: ['dateonly_s'],
                order: ['desc']
            },
            'dateAsc': {
                sort: ['date_dt'],
                order: ['asc']
            },
            'distance': {
                sort: ['geodist()'],
                order: ['asc']
            },
            'eleDesc': {
                sort: ['geo_ele_f'],
                order: ['desc']
            },
            'eleAsc': {
                sort: ['geo_ele_f'],
                order: ['asc']
            },
            'location': {
                sort: ['loc_lochirarchie_s'],
                order: ['asc']
            },
            'relevance': {
            }
        },
        filterMapping: {
            'html': 'html_txt'
        },
        fieldMapping: {
        }
    };

    constructor(config: any, records: any, itemsJsConfig: ExtendedItemsJsConfig) {
        console.debug('init itemsjs with config', itemsJsConfig, records);
        super(config, new GeoDocAdapterResponseMapper(config), records, itemsJsConfig);
    }

    mapToAdapterDocument(props: any): any {
        return this.mapper.mapToAdapterDocument({}, props);
    }

    getItemsJsConfig(): ItemsJsConfig {
        return GeoDocItemsJsAdapter.itemsJsConfig;
    }
}

