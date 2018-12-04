import {Injectable} from '@angular/core';
import {GeoDocSearchResult} from '../../../shared/gdoc-commons/model/container/gdoc-searchresult';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {SearchParameterUtils} from '@dps/mycms-commons/dist/search-commons/services/searchparameter.utils';
import {CommonDocSearchFormUtils} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-searchform-utils.service';

@Injectable()
export class GeoDocSearchFormUtils extends CommonDocSearchFormUtils {

    constructor(protected searchFormUtils: SearchFormUtils, protected searchParameterUtils: SearchParameterUtils) {
        super(searchFormUtils, searchParameterUtils);
    }

    getWhereValues(searchResult: GeoDocSearchResult): any[] {
         return this.searchFormUtils.getFacetValues(searchResult, 'loc_lochirarchie_txt', '', '');
    }

    getSubTypeValues(searchResult: GeoDocSearchResult): any[] {
         return this.searchFormUtils.getFacetValues(searchResult, 'subtype_ss', '', '');
    }

    getTechDataAscentValues(searchResult: GeoDocSearchResult): any[] {
         return this.searchFormUtils.getFacetValues(searchResult, 'data_tech_alt_asc_facet_is', '', '');
    }

    getTechDataAltitudeMaxValues(searchResult: GeoDocSearchResult): any[] {
         return this.searchFormUtils.getFacetValues(searchResult, 'data_tech_alt_max_facet_is', '', '');
    }

    getTechDataDistanceValues(searchResult: GeoDocSearchResult): any[] {
         return this.searchFormUtils.getFacetValues(searchResult, 'data_tech_dist_facets_fs', '', '');
    }

    getTechDataDurationValues(searchResult: GeoDocSearchResult): any[] {
         return this.searchFormUtils.getFacetValues(searchResult, 'data_tech_dur_facet_fs', '', '');
    }

    public extractNearbyPos(nearby: string): any[] {
        if (!nearby || nearby.length <= 0) {
            return [];
        }

        const [lat, lon, dist] = nearby.split('_');
        if (! (lat && lon && dist)) {
            return [];
        }

        return [lat, lon, dist];
    }

    public joinNearbyPos(rawValues: {}): string {
        const [lat, lon, dist] = this.extractNearbyPos(rawValues['nearby']);
        let nearby = '';
        if (lat && lon && dist && rawValues['nearbyAddress']) {
            nearby = [lat, lon, rawValues['nearbyDistance']].join('_');
        }

        return nearby;
    }
}
