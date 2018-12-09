import {GenericSolrAdapter} from '@dps/mycms-commons/dist/search-commons/services/generic-solr.adapter';
import {GeoDocRecord} from '../model/records/gdoc-record';
import {GeoDocSearchForm} from '../model/forms/gdoc-searchform';
import {GeoDocSearchResult} from '../model/container/gdoc-searchresult';
import {GeoDocAdapterResponseMapper} from './gdoc-adapter-response.mapper';
import {SolrConfig} from '@dps/mycms-commons/dist/search-commons/services/solr-query.builder';
import {Mapper} from "js-data";
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';

export class GeoDocSolrAdapter extends GenericSolrAdapter<GeoDocRecord, GeoDocSearchForm, GeoDocSearchResult> {

    public static solrConfig: SolrConfig = {
        spatialField: 'geo_loc_p',
        spatialSortKey: 'distance',
        fieldList: ['id', 'image_id_i', 'loc_id_i',
            'dateshow_dt', 'desc_txt', 'desc_md_txt', 'desc_html_txt', 'geo_lon_s', 'geo_lat_s', 'geo_dele_s', 'geo_loc_p',
            'data_tech_alt_asc_i', 'data_tech_alt_desc_i', 'data_tech_alt_min_i', 'data_tech_alt_max_i',
            'data_tech_dist_f', 'data_tech_dur_f',
            'data_info_guides_s', 'data_info_region_s', 'data_info_baseloc_s', 'data_info_destloc_s',
            'gpstracks_basefile_s', 'gpstracks_src_s', 'keywords_txt', 'loc_lochirarchie_s', 'loc_lochirarchie_ids_s', 'name_s', 'type_s',
            'subtype_ss', 'subtype_s', 'i_fav_url_txt'],
        facetConfigs: {
            'subtype_ss': {
                'f.subtype_ss.facet.limit': '-1',
                'f.subtype_ss.facet.sort': 'index'
            },
            'data_tech_alt_asc_facet_is': {
                'f.data_tech_alt_asc_facet_is.facet.limit': '-1',
                'f.data_tech_alt_asc_facet_is.facet.sort': 'index'
            },
            'data_tech_alt_max_facet_is': {
                'f.data_tech_alt_max_facet_is.facet.limit': '-1',
                'f.data_tech_alt_max_facet_is.facet.sort': 'index'
            },
            'data_tech_dist_facets_fs': {
                'f.data_tech_dist_facets_fs.facet.limit': '-1',
                'f.data_tech_dist_facets_fs.facet.sort': 'index'
            },
            'data_tech_dur_facet_fs': {
                'f.data_tech_dur_facet_fs.facet.limit': '-1',
                'f.data_tech_dur_facet_fs.facet.sort': 'index'
            },
            'keywords_txt': {
                'f.keywords_txt.facet.prefix': '',
                'f.keywords_txt.facet.limit': '-1',
                'f.keywords_txt.facet.sort': 'count'
            },
            'loc_id_i': {},
            'loc_lochirarchie_txt': {},
            'month_is': {
                'f.month_is.facet.limit': '-1',
                'f.month_is.facet.sort': 'index'
            },
            'playlists_txt': {
            },
            'type_txt': {},
            'week_is': {
                'f.week_is.facet.limit': '-1',
                'f.week_is.facet.sort': 'index'
            },
            'year_is': {
                'f.year_is.facet.limit': '-1',
                'f.year_is.facet.sort': 'index'
            }
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
            'dataTechDurDesc': {
                'sort': 'data_tech_dur_f desc'
            },
            'dataTechAltDesc': {
                'sort': 'data_tech_alt_asc_i desc'
            },
            'dataTechMaxDesc': {
                'sort': 'data_tech_alt_max_i desc'
            },
            'dataTechDistDesc': {
                'sort': 'data_tech_dist_f desc'
            },
            'dataTechDurAsc': {
                'sort': 'data_tech_dur_f asc'
            },
            'dataTechAltAsc': {
                'sort': 'data_tech_alt_asc_i asc'
            },
            'dataTechMaxAsc': {
                'sort': 'data_tech_alt_max_i asc'
            },
            'dataTechDistAsc': {
                'sort': 'data_tech_dist_f asc'
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
            image_id_i: props.imageId,
            loc_id_i: props.locId,

            dateshow_dt: props.dateshow,
            desc_txt: props.descTxt,
            desc_md_txt: props.descMd,
            desc_html_txt: props.descHtml,
            keywords_txt: (props.keywords ? props.keywords.split(', ').join(',,') : ''),

            name_s: props.name,
            playlists_txt: (props.playlists ? props.playlists.split(', ').join(',,') : ''),
            type_s: props.type,
            type_txt: props.type,

            geo_lon_s: props.geoLon,
            geo_lat_s: props.geoLat,
            geo_ele_s: props.geoEle,
            geo_loc_p: props.geoLoc,
            gpstracks_basefile_s: props.gpsTrackBasefile,
            gpstracks_src_s: props.gpsTrackSrc,
            loc_lochirarchie_s: (props.locHirarchie ? props.locHirarchie
                .toLowerCase()
                .replace(/[ ]*->[ ]*/g, ',,')
                .replace(/ /g, '_') : ''),
            loc_lochirarchie_ids_s: (props.locHirarchieIds ? props.locHirarchieIds
                .toLowerCase()
                .replace(/,/g, ',,')
                .replace(/ /g, '_') : ''),

            data_info_guides_s: BeanUtils.getValue(props, 'gdocdatainfo.guides'),
            data_tech_alt_min_i: BeanUtils.getValue(props, 'gdocdatatech.altMin'),
            data_tech_alt_min_facet_is: this.parseFacet(BeanUtils.getValue(props, 'gdocdatatech.altMin'), 500),
            data_tech_alt_max_i: BeanUtils.getValue(props, 'gdocdatatech.altMax'),
            data_tech_alt_max_facet_is: this.parseFacet(BeanUtils.getValue(props, 'gdocdatatech.altMax'), 500),
            data_tech_alt_asc_i: BeanUtils.getValue(props, 'gdocdatatech.altAsc'),
            data_tech_alt_asc_facet_is: this.parseFacet(BeanUtils.getValue(props, 'gdocdatatech.altAsc'), 500),
            data_tech_alt_desc_i: BeanUtils.getValue(props, 'gdocdatatech.altDesc'),
            data_tech_alt_desc_facet_is: this.parseFacet(BeanUtils.getValue(props, 'gdocdatatech.altDesc'), 500),
            data_tech_dist_f: BeanUtils.getValue(props, 'gdocdatatech.dist'),
            data_tech_dist_facets_fs: this.parseFacet(BeanUtils.getValue(props, 'gdocdatatech.dist'), 5),
            data_tech_dur_f: BeanUtils.getValue(props, 'gdocdatatech.dur'),
            data_tech_dur_facet_fs: this.parseFacet(BeanUtils.getValue(props, 'gdocdatatech.dur'), 5)
        };
        values['html_txt'] = [values.desc_txt, values.name_s, values.keywords_txt, values.type_s].join(' ');

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
        return (value ? Math.ceil(Number.parseFloat(value) / base) * base + '' : undefined)
    }

}

