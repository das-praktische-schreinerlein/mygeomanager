import {GeoDocRecord} from '../model/records/gdoc-record';
import {GeoDocSearchForm} from '../model/forms/gdoc-searchform';
import {GeoDocSearchResult} from '../model/container/gdoc-searchresult';
import {GeoDocAdapterResponseMapper} from './gdoc-adapter-response.mapper';
import {ItemsJsConfig} from '@dps/mycms-commons/dist/search-commons/services/itemsjs-query.builder';
import {GenericItemsJsAdapter} from '@dps/mycms-commons/dist/search-commons/services/generic-itemsjs.adapter';

export class GeoDocItemsJsAdapter extends GenericItemsJsAdapter<GeoDocRecord, GeoDocSearchForm, GeoDocSearchResult> {
    public static itemsJsConfig: ItemsJsConfig = {
        spatialField: 'geo_loc_p',
        spatialSortKey: 'distance',
        searchableFields: ['id', 'loc_id_i',
            'dateshow_dt', 'desc_txt', 'desc_md_txt', 'desc_html_txt', 'geo_lon_s', 'geo_lat_s',
            'geo_ele_s', 'geo_ele_f', 'geo_loc_p',
            'gpstracks_basefile_s', 'keywords_txt', 'loc_lochirarchie_s', 'loc_lochirarchie_ids_s', 'name_s', 'type_s',
            'playlists_txt', 'subtype_ss', 'subtype_s'],
        aggregations: {
            'subtype_ss': {
            },
            'keywords_txt': {
            },
            'loc_lochirarchie_txt': {},
            'playlists_txt': {
            },
            'type_txt': {},
            'id': {}
        },
        sortings: {
            'date': {
                'field': 'dateonly_s',
                'order:': 'desc'
            },
            'dateAsc': {
                'sort': 'date_dt',
                'order:': 'asc'
            },
            'distance': {
                'sort': 'geodist()',
                'order:': 'asc'
            },
            'eleDesc': {
                'sort': 'geo_ele_f',
                'order:': 'desc'
            },
            'eleAsc': {
                'sort': 'geo_ele_f',
                'order:': 'asc'
            },
            'location': {
                'sort': 'loc_lochirarchie_s',
                'order:': 'asc'
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

    constructor(config: any, data: any) {
        super(config, new GeoDocAdapterResponseMapper(config), data, GeoDocItemsJsAdapter.itemsJsConfig);
    }

    mapToAdapterDocument(props: any): any {
        const values = {
            id: props.id,
            loc_id_i: props.locId,
            dateshow_dt: props.dateshow,
            desc_txt: props.descTxt,
            desc_md_txt: props.descMd,
            desc_html_txt: props.descHtml,
            geo_lon_s: props.geoLon,
            geo_lat_s: props.geoLat,
            geo_ele_s: props.geoEle,
            geo_ele_f: props.geoEle,
            geo_loc_p: props.geoLoc,
            gpstracks_basefile_s: props.gpsTrackBasefile,
            keywords_txt: (props.keywords ? props.keywords.split(', ').join(',,KW_') : ''),
            loc_lochirarchie_s: (props.locHirarchie ? props.locHirarchie
                .toLowerCase()
                .replace(/[ ]*->[ ]*/g, ',,')
                .replace(/ /g, '_') : ''),
            loc_lochirarchie_ids_s: (props.locHirarchieIds ? props.locHirarchieIds
                .toLowerCase()
                .replace(/,/g, ',,')
                .replace(/ /g, '_') : ''),
            name_s: props.name,
            type_s: props.type,

        };

        values['html_txt'] = [values.desc_txt, values.name_s, values.keywords_txt, values.type_s].join(' ');

        return values;
    }

    getItemsJsConfig(): ItemsJsConfig {
        return GeoDocItemsJsAdapter.itemsJsConfig;
    }
}

