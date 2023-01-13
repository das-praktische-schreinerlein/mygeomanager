import {Mapper, Record} from 'js-data';
import {GeoDocRecord, GeoDocRecordFactory} from '../model/records/gdoc-record';
import {MapperUtils} from '@dps/mycms-commons/dist/search-commons/services/mapper.utils';
import {GenericAdapterResponseMapper} from '@dps/mycms-commons/dist/search-commons/services/generic-adapter-response.mapper';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';

export class GeoDocAdapterResponseMapper implements GenericAdapterResponseMapper {
    protected mapperUtils = new MapperUtils();
    protected config: {} = {};

    constructor(config: any) {
        this.config = config;
    }

    mapToAdapterDocument(mapping: {}, props: GeoDocRecord): any {
        const values = {};
        values['id'] = props.id;
        values['loc_id_i'] = props.locId;
        values['loc_id_parent_i'] = props.locIdParent;
        values['blocked_i'] = props.blocked;
        values['desc_txt'] = props.descTxt;
        values['desc_md_txt'] = props.descMd;
        values['desc_html_txt'] = props.descHtml;
        values['geo_lon_s'] = props.geoLon;
        values['geo_lat_s'] = props.geoLat;
        values['geo_ele_s'] = props.geoEle;
        values['geo_ele_f'] = props.geoEle;
        values['data_tech_alt_max_i'] = props.geoEle;
        values['geo_loc_p'] = props.geoLoc;
        values['gpstrack_src_s'] = props.gpsTrackSrc;
        values['gpstracks_basefile_s'] = props.gpsTrackBasefile;
        values['keywords_txt'] =
            (props.keywords
                ? props.keywords.split(', ').join(',')
                : undefined);
        values['loc_lochirarchie_s'] = (props.locHirarchie
            ? props.locHirarchie
                .toLowerCase()
                .replace(/[ ]*->[ ]*/g, ',,')
                .replace(/ /g, '_')
            : undefined);
        values['loc_lochirarchie_ids_s'] = (props.locHirarchieIds
            ? props.locHirarchieIds
                .toLowerCase()
                .replace(/,/g, ',,')
                .replace(/ /g, '_')
            : undefined);
        values['name_s'] = props.name;
        values['playlists_txt'] =
            (props.playlists
                ? props.playlists.split(', ').join(',,')
                : undefined);
        values['type_s'] = props.type;
        values['subtype_s'] = props.subtype;

        values['html_txt'] = [
            values['type_s'],
            values['name_s'],
            values['keywords_txt']
                ? values['keywords_txt']
                : '',
            values['desc_txt']
        ].join(' ');

        return values;
    }

    mapValuesToRecord(mapper: Mapper, values: {}): GeoDocRecord {
        return GeoDocRecordFactory.createSanitized(values);
    }

    mapResponseDocument(mapper: Mapper, doc: any, mapping: {}): Record {
        const values = {};
        values['id'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'id', undefined);
        values['locId'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'loc_id_i', undefined);
        values['locIdParent'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'loc_id_parent_i', undefined);

        const subtypeField = doc[this.mapperUtils.mapToAdapterFieldName(mapping, 'subtypes_ss')];
        if (subtypeField !== undefined && Array.isArray(subtypeField)) {
            values['subtypes'] = subtypeField.join(',');
        }
        values['blocked'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'blocked_i', undefined);
        values['descTxt'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'desc_txt', undefined);
        values['descHtml'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'desc_html_txt', undefined);
        values['descMd'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'desc_md_txt', undefined);

        const origKeywordsArr = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'keywords_txt', '').split(',');
        const allowedKeywordPatterns = BeanUtils.getValue(this.config, 'mapperConfig.allowedKeywordPatterns');
        const replaceKeywordPatterns = BeanUtils.getValue(this.config, 'mapperConfig.replaceKeywordPatterns');

        const srcKeywordsArr = [];
        if (replaceKeywordPatterns && replaceKeywordPatterns.length > 0) {
            for (let keyword of origKeywordsArr) {
                keyword = keyword.trim();
                if (keyword === '') {
                    continue;
                }

                for (const pattern of replaceKeywordPatterns) {
                    keyword = keyword.replace(new RegExp(pattern[0]), pattern[1]);
                }

                srcKeywordsArr.push(keyword);
            }
        }

        const newKeywordsArr = [];
        for (let keyword of srcKeywordsArr) {
            keyword = keyword.trim();
            if (keyword === '') {
                continue;
            }

            if (allowedKeywordPatterns && allowedKeywordPatterns.length > 0) {
                for (const pattern of allowedKeywordPatterns) {
                    if (keyword.match(new RegExp(pattern))) {
                        newKeywordsArr.push(keyword);
                        break;
                    }
                }
            } else {
                newKeywordsArr.push(keyword);
            }
        }
        values['keywords'] = newKeywordsArr.join(', ');

        values['name'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'name_s', undefined);
        values['playlists'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'playlists_txt', '')
            .split(',,').join(', ');
        values['subtype'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'subtype_s', undefined);
        values['type'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'type_s', undefined);

        values['geoLon'] = this.mapperUtils.getAdapterCoorValue(doc,
            this.mapperUtils.mapToAdapterFieldName(mapping, 'geo_lon_s'), undefined);
        values['geoLat'] = this.mapperUtils.getAdapterCoorValue(doc,
            this.mapperUtils.mapToAdapterFieldName(mapping, 'geo_lat_s'), undefined);
        values['geoEle'] = this.mapperUtils.getAdapterCoorValue(doc,
            this.mapperUtils.mapToAdapterFieldName(mapping, 'geo_ele_s'), undefined);
        values['geoLoc'] = this.mapperUtils.getAdapterCoorValue(doc,
            this.mapperUtils.mapToAdapterFieldName(mapping, 'geo_loc_p'), undefined);
        values['gpsTrackSrc'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'gpstrack_src_s', undefined);
        values['gpsTrackBasefile'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'gpstracks_basefile_s', undefined);
        values['locHirarchie'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'loc_lochirarchie_s', '')
            .replace(/,,/g, ' -> ')
            .replace(/,/g, ' ')
            .replace(/_/g, ' ')
            .trim();
        values['locHirarchieIds'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'loc_lochirarchie_ids_s', '')
            .replace(/_/g, ' ').trim()
            .replace(/[,]+/g, ',').replace(/(^,)|(,$)/g, '');

        // console.log('mapResponseDocument values:', values);
        const record: GeoDocRecord = <GeoDocRecord>mapper.createRecord(
            GeoDocRecordFactory.instance.getSanitizedValues(values, {}));

        // console.log('mapResponseDocument record full:', record);

        return record;
    }

    mapDetailDataToAdapterDocument(mapper: Mapper, profile: string, record: Record, docs: any[]): void {
    }

    mapDetailResponseDocuments(mapper: Mapper, profile: string, record: Record, docs: any): void {
    }

}

