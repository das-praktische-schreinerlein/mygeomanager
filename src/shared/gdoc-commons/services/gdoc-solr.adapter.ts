import {GenericSolrAdapter} from '@dps/mycms-commons/dist/search-commons/services/generic-solr.adapter';
import {GeoDocRecord} from '../model/records/gdoc-record';
import {GeoDocSearchForm} from '../model/forms/gdoc-searchform';
import {GeoDocSearchResult} from '../model/container/gdoc-searchresult';
import {GeoDocAdapterResponseMapper} from './gdoc-adapter-response.mapper';
import {SolrConfig} from '@dps/mycms-commons/dist/search-commons/services/solr-query.builder';
import {Mapper} from 'js-data';

export class GeoDocSolrAdapter extends GenericSolrAdapter<GeoDocRecord, GeoDocSearchForm, GeoDocSearchResult> {

    public static solrConfig: SolrConfig = {
        spatialField: 'geo_loc_p',
        spatialSortKey: 'distance',
        fieldList: ['id', 'image_id_i', 'loc_id_i',
            'dateshow_dt', 'desc_txt', 'desc_md_txt', 'desc_html_txt', 'geo_lon_s', 'geo_lat_s',
            'geo_ele_s', 'geo_ele_f', 'geo_loc_p',
            'gpstracks_basefile_s', 'gpstracks_src_s', 'keywords_txt', 'loc_lochirarchie_s', 'loc_lochirarchie_ids_s', 'name_s', 'type_s',
            'subtype_ss', 'subtype_s'],
        facetConfigs: {
            'subtype_ss': {
                'f.subtype_ss.facet.limit': '-1',
                'f.subtype_ss.facet.sort': 'index'
            },
            'geo_ele_facet_is': {
                'f.geo_ele_facet_is.facet.limit': '-1',
                'f.geo_ele_facet_is.facet.sort': 'index'
            },
            'keywords_txt': {
                'f.keywords_txt.facet.prefix': '',
                'f.keywords_txt.facet.limit': '-1',
                'f.keywords_txt.facet.sort': 'count'
            },
            'loc_id_i': {},
            'loc_lochirarchie_txt': {},
            'playlists_txt': {
            },
            'type_txt': {}
        },
        commonSortOptions: {
            'bq': 'type_s:IMAGE^1',
            'qf': 'html_txt^12.0 name_txt^10.0 desc_txt^8.0 keywords_txt^6.0 loc_lochirarchie_txt^4.0',
            'defType': 'edismax',
            'boost': 'recip(rord(date_dts),1,1000,1000)'
        },
        sortMapping: {
            'date': {
                'sort': 'datesort_dt desc'
            },
            'dateAsc': {
                'sort': 'datesort_dt asc'
            },
            'distance': {
                'sort': 'geodist() asc'
            },
            'eleDesc': {
                'sort': 'geo_ele_f desc'
            },
            'eleAsc': {
                'sort': 'geo_ele_f asc'
            },
            'location': {
                'sort': 'loc_lochirarchie_s asc'
            },
            'relevance': {
            }
        },
        filterMapping: {
            'html': 'html_txt'
        },
        fieldMapping: {}
    };

    constructor(config: any) {
        super(config, new GeoDocAdapterResponseMapper(config));
    }

    mapToAdapterDocument(props: any): any {
        const values = {
            id: props.id,
            loc_id_i: props.locId,

            dateshow_dt: props.dateshow,
            desc_txt: props.descTxt,
            desc_md_txt: props.descMd,
            desc_html_txt: props.descHtml,
            keywords_txt: (props.keywords
                ? props.keywords.split(', ').join(',,')
                : undefined),

            name_s: props.name,
            playlists_txt: (props.playlists
                ? props.playlists.split(', ').join(',,')
                : undefined),
            type_s: props.type,
            type_txt: props.type,

            geo_lon_s: props.geoLon,
            geo_lat_s: props.geoLat,
            geo_ele_s: props.geoEle,
            geo_ele_f: props.geoEle,
            geo_ele_facet_is: this.parseFacet(props.geoEle, 500),
            geo_loc_p: props.geoLoc,
            gpstracks_basefile_s: props.gpsTrackBasefile,
            gpstracks_src_s: props.gpsTrackSrc,
            loc_lochirarchie_s: (props.locHirarchie
                ? props.locHirarchie
                    .toLowerCase()
                    .replace(/[ ]*->[ ]*/g, ',,')
                    .replace(/ /g, '_')
                : undefined),
            loc_lochirarchie_ids_s: (props.locHirarchieIds
                ? props.locHirarchieIds
                    .toLowerCase()
                    .replace(/,/g, ',,')
                    .replace(/ /g, '_')
                : undefined)

        };
        values['html_txt'] = [
            values.type_s,
            values.name_s,
            values.keywords_txt
                ? values.keywords_txt
                : '',
            values.desc_txt,
        ].join(' ');

        return values;
    }

    create(mapper: Mapper, record: any, opts?: any): Promise<GeoDocRecord> {
        opts = opts || {};
        if (opts.realSource) {
            record = opts.realSource;
        }

        return super.create(mapper, record, opts);
    }

    update(mapper: Mapper, id: string | number, record: any, opts?: any): Promise<GeoDocRecord> {
        opts = opts || {};
        if (opts.realSource) {
            record = opts.realSource;
        }

        return super.update(mapper, id, record, opts);
    }

    getHttpEndpoint(method: string): string {
        const updateMethods = ['create', 'destroy', 'update'];
        if (updateMethods.indexOf(method.toLowerCase()) >= 0) {
            return 'update?';
        }
        return 'select?';
    }

    getSolrConfig(): SolrConfig {
        return GeoDocSolrAdapter.solrConfig;
    }

    findAll(mapper: Mapper, query: any, opts: any): Promise<GeoDocRecord[]> {
        opts.offset = opts.offset || 0;
        opts.limit = opts.limit || 10;
        return super.findAll(mapper, query, opts);
    }

    protected parseFacet(value: any, base: number): string {
        return (value ? Math.ceil(Number.parseFloat(value) / base) * base + '' : undefined);
    }

}

