import {Injectable} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {GeoDocRecord} from '../../../shared/gdoc-commons/model/records/gdoc-record';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {MapElement} from '@dps/mycms-frontend-commons/dist/angular-maps/services/leaflet-geo.plugin';
import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import * as L from 'leaflet';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';
import {
    CommonDocContentUtils,
    CommonDocContentUtilsConfig,
    CommonItemData
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-contentutils.service';
import LatLng = L.LatLng;

export interface GeoDocItemData extends CommonItemData {
    tracks?: GeoDocRecord[];
    flgShowMap?: boolean;
    flgShowProfileMap?: boolean;
    flgMapAvailable?: boolean;
    flgProfileMapAvailable?: boolean;
}

@Injectable()
export class GeoDocContentUtils extends CommonDocContentUtils {
    constructor(sanitizer: DomSanitizer, cdocRoutingService: CommonDocRoutingService, appService: GenericAppService) {
        super(sanitizer, cdocRoutingService, appService);
    }

    getLocationHierarchy(record: GeoDocRecord, lastOnly: boolean): any[] {
        if (record.locHirarchie === undefined || record.locHirarchieIds === undefined) {
            return [];
        }

        const hierarchyTexts = record.locHirarchie.split(' -> ');
        const hierarchyIds = record.locHirarchieIds.split(',');
        if (hierarchyIds.length !== hierarchyTexts.length) {
            return [];
        }

        const hierarchy = [];
        let lastIndex = hierarchyTexts.length - 1;
        if (record.type === 'LOCATION' && hierarchy.length > 1) {
            lastIndex--;
        }

        for (let i = lastOnly ? lastIndex : 0; i < hierarchyTexts.length; i++) {
            if (hierarchyIds[i] !== undefined && hierarchyTexts[i] !== undefined && hierarchyTexts[i].length > 0) {
                hierarchy.push(['LOCATION_' + hierarchyIds[i], hierarchyTexts[i]]);
            }
        }

        return hierarchy;
    }

    getStyleClassForRecord(record: GeoDocRecord, layout: string): string[] {
        const value = record['gdocratepers'] || {gesamt: 0};
        const rate = Math.round(((value['gesamt'] || 0) / 3) + 0.5);
        return ['list-item-persrate-' + rate, 'list-item-' + layout + '-persrate-' + rate];
    }

    getGeoDocSubItemFiltersForType(record: GeoDocRecord, type: string, theme: string, minPerPage?: number): any {
        const filters = {
            type: type
        };

        // filter theme only for locations
        if (record.type === 'LOCATION' && theme !== undefined) {
            filters['theme'] = theme;
        }
        filters['sort'] = 'relevance';

        if (record.type === 'LOCATION') {
            if (type === 'LOCATION') {
                filters['moreFilter'] = 'loc_parent_id_i:' + record.locId;
                filters['sort'] = 'location';
            } else {
                filters['moreFilter'] = 'loc_lochirarchie_ids_txt:' + record.locId;
            }
        }

        if (minPerPage && minPerPage > 0 && minPerPage > filters['perPage']) {
            filters['perPage'] = minPerPage;
        }

        return filters;
    }

    createMapElementForGeoDoc(record: GeoDocRecord, code: string, showImageTrackAndGeoPos: boolean): MapElement[] {
        const trackUrl = record.gpsTrackBasefile;

        const showTrack = (trackUrl !== undefined && trackUrl.length > 0 && (showImageTrackAndGeoPos))
            || (record.gpsTrackSrc !== undefined && record.gpsTrackSrc !== null && record.gpsTrackSrc.length > 0);
        const showGeoPos = (!showTrack) && record.geoLat && record.geoLon &&
            record.geoLat !== '0.0' && record.geoLon !== '0.0';
        const mapElements: MapElement[] = [];

        if (showTrack) {
            let storeUrl;
            if (this.appService.getAppConfig()['useAssetStoreUrls'] === true) {
                storeUrl = this.appService.getAppConfig()['tracksBaseUrl'] + 'json/' + record.id;
            } else {
                storeUrl = this.appService.getAppConfig()['tracksBaseUrl'] + trackUrl + '.json';
            }
            const mapElement: MapElement = {
                id: record.id,
                code: code,
                name: record.name,
                trackUrl: storeUrl,
                trackSrc: record.gpsTrackSrc,
                popupContent: '<b>' + '&#128204;' + code + ' ' + record.type + ': ' + record.name + '</b>',
                type: record.type
            };
            mapElements.push(mapElement);
        }
        if (showGeoPos) {
            const ele = BeanUtils.getValue(record, 'geoEle') || BeanUtils.getValue(record, 'gdocdatatech.altMax');
            const point = ele !== undefined ? new LatLng(+record.geoLat, +record.geoLon, +ele) : new LatLng(+record.geoLat, +record.geoLon);
            const mapElement: MapElement = {
                id: record.id,
                code: code,
                name: record.type + ': ' + record.name,
                point: point,
                popupContent: '<b>' + '&#128204;' + code + ' ' + record.type + ': ' + record.name + '</b>',
                type: record.type
            };
            mapElements.push(mapElement);
        }

        return mapElements;
    }

    updateItemData(itemData: GeoDocItemData, record: GeoDocRecord, layout: string): boolean {
        super.updateItemData(itemData, record, layout);
        if (record === undefined) {
            itemData.flgShowMap = false;
            itemData.flgShowProfileMap = false;
            itemData.tracks = [];
            return false;
        }

        itemData.styleClassFor = this.getStyleClassForRecord(<GeoDocRecord>itemData.currentRecord, layout);

        if (record !== undefined && (record.gpsTrackBasefile || record.geoLoc !== undefined
            || (record.gpsTrackSrc !== undefined && record.gpsTrackSrc.length > 20))) {
            itemData.tracks = [record];
            itemData.flgMapAvailable = true;
            itemData.flgProfileMapAvailable = (record.gpsTrackBasefile !== undefined
                || (record.gpsTrackSrc !== undefined && record.gpsTrackSrc.length > 20));
        } else {
            itemData.tracks = [];
            itemData.flgMapAvailable = false;
            itemData.flgProfileMapAvailable = false;
        }

        itemData.flgShowMap = itemData.flgMapAvailable;
        itemData.flgShowProfileMap = itemData.flgProfileMapAvailable;
    }

    protected getServiceConfig(): CommonDocContentUtilsConfig {
        return {
            cdocRecordRefIdField: 'gdoc_id',
            cdocAudiosKey: undefined,
            cdocImagesKey: undefined,
            cdocVideosKey: undefined
        };
    }
}
