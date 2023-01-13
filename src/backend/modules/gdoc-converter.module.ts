import {Mapper} from 'js-data';
import {GeoDocRecord} from '../shared/gdoc-commons/model/records/gdoc-record';
import {GeoDocDataService} from '../shared/gdoc-commons/services/gdoc-data.service';
import {GeoDocAdapterResponseMapper} from '../shared/gdoc-commons/services/gdoc-adapter-response.mapper';
import * as fs from 'fs';
import {ServerLogUtils} from '@dps/mycms-server-commons/dist/server-commons/serverlog.utils';
import {Feature, FeatureCollection} from 'geojson';

export class GeoDocConverterModule {
    private dataService: GeoDocDataService;
    private backendConfig: {};
    private keywordSrcLst = ['natural', 'tourism', 'surface', 'condition', 'man_made', 'amenity', 'sport', 'climbing',
                            'climbing:rock'];

    constructor(backendConfig, dataService: GeoDocDataService) {
        this.dataService = dataService;
        this.backendConfig = backendConfig;
    }

    public convertGeoJSONOGeoDoc(srcFile: string): Promise<GeoDocRecord[]> {
        const mapper: Mapper = this.dataService.getMapper('gdoc');
        const responseMapper = new GeoDocAdapterResponseMapper(this.backendConfig);
        const records: GeoDocRecord[] = [];
        const geoJsonObj: FeatureCollection = JSON.parse(fs.readFileSync(srcFile, {encoding: 'utf8'}));
        return new Promise<GeoDocRecord[]>((resolve, reject) => {
            const rootType = geoJsonObj.type;
            if (rootType !== 'FeatureCollection') {
                return reject('no valid geojson - type of FeatureCollection required - current:' + ServerLogUtils.sanitizeLogMsg(rootType));
            }

            const features: Feature[] = geoJsonObj.features;
            if (features == undefined || features.length <= 0) {
                return resolve([]);
            }

            for (let i = 0; i < features.length; i++) {
                const feature: Feature = features[i];
                if (feature.type !== 'Feature') {
                    return reject('no valid geojson - type of Feature required - current '  + i + ':' + ServerLogUtils.sanitizeLogMsg(feature));
                }

                if (feature.properties['name'] === undefined || feature.properties['name'].length <= 0) {
                    continue;
                }

                const name = this.parseName(feature);
                if (name === undefined || name.length <= 0) {
                    continue;
                }

                let keywords = this.parseKeywords(feature);
                const guides = this.parseGuides(feature);
                const coordinate = this.parseCoordinate(feature);
                const climbing = this.parseClimbing(feature);

                if (climbing && climbing['types']) {
                    keywords = keywords.concat(climbing['types']);
                }

                let desc = undefined;
                if (guides.length > 0) {
                    desc = desc
                        ? desc + '\n'
                        : '';
                    desc += 'Guides:\n  - ' + guides.join('  - ')  + '\n';
                }

                if (climbing) {
                    desc = desc
                        ? desc + '\n'
                        : '';
                    desc += 'Climbing:'
                        + (climbing['types']
                            ? ' ' + climbing['types'].join(', ')
                            : '')
                        + (climbing['grades']
                            ? ' ' + climbing['grades'].join(', ')
                            : '')
                        + (climbing['length']
                            ? ' ' +  climbing['length']
                            : '')
                        + (climbing['rock']
                            ? ' ' +  climbing['rock']
                            : '')
                        + (climbing['orientation']
                            ? ' ' +  climbing['orientation']
                            : '')
                        + '\n';
                }

                // TODO type: INFO fuer guides und osm-referenz
                // TODO no moe guied on desc
                // TODO addd publishr info on desc -> komparss ...: source, source:ele
                const geoObj = <GeoDocRecord>responseMapper.mapResponseDocument(mapper, {
                    type_s: 'POI',
                    id: feature.id,
                    geo_lat_s: coordinate['lat'],
                    geo_lon_s: coordinate['lon'],
                    geo_loc_p: coordinate['loc'],
                    desc_txt: desc,
                    geo_ele_s: coordinate['ele'],
                    keywords_txt: keywords.join((', ')),
                    geo_ele_f: coordinate['ele'],
                    loc_id_i: records.length + 1,
                    name_s: name
                }, {});
                records.push(geoObj);
            }

            return resolve(records);
        });
    }

    public parseKeywords(feature: Feature): string[] {
        const keywords = [];
        for (let k = 0; k < this.keywordSrcLst.length; k++) {
            const keywordsSrc = this.keywordSrcLst[k];
            if (feature.properties[keywordsSrc] !== undefined) {
                keywords.push(keywordsSrc + '_' + feature.properties[keywordsSrc]);
            }
        }

        return keywords;
    }

    public parseGuides(feature: Feature): string[] {
        const guides = [];
        if (feature.properties['wikidata']) {
            const wikidataUrl = 'wikidata.org/wiki/' + feature.properties['wikidata'];
            guides.push('[' + wikidataUrl + ']' + '(https://www.' + wikidataUrl + ')');
        }

        if (feature.properties['wikipedia']) {
            const urlParts = feature.properties['wikipedia'].split(':');
            let wikipediaUrl = 'wikipedia.org/wiki/' +
                (urlParts.length > 0
                    ? urlParts.slice(1).join(':')
                    : urlParts[0]);
            let wikipediaLang = urlParts.length > 0
                ? urlParts[0]
                : 'en';
            guides.push('[' + wikipediaUrl + ']' + '(https://' + wikipediaLang + '.' + wikipediaUrl + ')');
        }

        if (feature.properties['website']) {
            guides.push('[' + feature.properties['website'] + ']' + '(' + feature.properties['website'] + ')');
        }

        return guides;
    }

    public parseCoordinate(feature: Feature): {} {
        if (feature.geometry === undefined) {
            return;
        }

        let geoLat = undefined;
        let geoLon = undefined;
        let geoLoc = undefined;
        const ele = feature.properties['ele'];

        if (feature.geometry.type === 'Point') {
            geoLon = feature.geometry.coordinates[0];
            geoLat = feature.geometry.coordinates[1];
        } else if (feature.geometry.type === 'Polygon') {
            geoLon = feature.geometry.coordinates[0][0][0];
            geoLat = feature.geometry.coordinates[0][0][1];
        }

        if (geoLat !== undefined && geoLon !== undefined) {
            geoLoc = geoLat + ',' + geoLon;
        }

        return  {
            lat: geoLat,
            lon: geoLon,
            loc: geoLoc,
            ele: ele
        }
    }

    public parseClimbing(feature: Feature): {} {
        const grades = [];
        for (const type of ['UIAA', 'french']) {
            const gradeMin = feature.properties['climbing:grade:' + type + ':min'];
            const gradeMax = feature.properties['climbing:grade:' + type + ':max'];
            if (gradeMin && gradeMax) {
                grades.push(type + ' ' + gradeMin + '-' + gradeMax);
                continue;
            }
            if (gradeMin) {
                grades.push(type + ' ' + gradeMin + '-?');
                continue;
            }

            if (gradeMax) {
                grades.push(type + ' ?-' + gradeMax);
                continue;
            }
        }

        const lengthMin = feature.properties['climbing:length:min'];
        const lengthMax = feature.properties['climbing:length:max'];
        const length = lengthMin && lengthMax
            ? lengthMin + '-' + lengthMax + 'm'
            : lengthMin
                ? lengthMin + '-?m'
                : lengthMax
                    ? '?-' + lengthMax + 'm'
                    : undefined;

        const types =  []
        if (feature.properties['climbing:sport']) {
            types.push('sportclimibing')
        }
        if (feature.properties['climbing:trad']) {
            types.push('tradclimibing')
        }

        const rock = feature.properties['climbing:rock']
            ? feature.properties['climbing:rock']
            : undefined;

        const orientation = feature.properties['climbing:orientation']
            ? feature.properties['climbing:orientation']
            : undefined;

        return grades.length > 0 || types.length > 0 || length || rock || orientation
            ? {
                grades: grades,
                types: types,
                length: length,
                rock: rock,
                orientation: orientation
            }
            : undefined;
    }

    public parseName(feature: Feature): string {
        return feature.properties['name:de'] != undefined
            ? feature.properties['name:de']
            + (feature.properties['name:it']
                ? ' - ' + feature.properties['name:it']
                : feature.properties['name:en']
                    ? ' - ' + feature.properties['name:en']
                    : '')
            : feature.properties['name']
    }
}
