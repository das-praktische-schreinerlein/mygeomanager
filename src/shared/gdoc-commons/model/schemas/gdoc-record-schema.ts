import {BaseEntityRecordSchema} from '@dps/mycms-commons/dist/search-commons/model/schemas/base-entity-record-schema';
import {Schema} from 'js-data';

export const GeoDocRecordSchema = new Schema({
    $schema: 'http://json-schema.org/draft-04/schema#',
    title: 'GeoDoc',
    description: 'Schema for a GeoDoc Record.',
    extends: BaseEntityRecordSchema,
    type: 'object',
    properties: {
        locId: {type: 'number'},
        locIdParent: {type: 'number'},
        descTxt: {type: 'string'},
        descMd: {type: 'string'},
        descHtml: {type: 'string'},
        geoDistance: {type: 'number'},
        geoLon: {type: 'string'},
        geoLat: {type: 'string'},
        geoEle: {type: 'string'},
        geoLoc: {type: 'string'},
        gpsTrackSrc: {type: 'string'},
        gpsTrackBasefile: {type: 'string'},
        keywords: {type: 'string'},
        locHirarchie: {type: 'string'},
        locHirarchieIds: {type: 'string'},
        name: {type: 'string', minLength: 1, maxLength: 255},
        playlists: {type: 'string'},
        subtype: {type: 'string'},
        type: {type: 'string', minLength: 1, maxLength: 255}
    }
});
