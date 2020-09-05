import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef} from '@angular/core';
import {GeoDocDataService} from '../../../../shared/gdoc-commons/services/gdoc-data.service';
import {GeoDocRecord} from '../../../../shared/gdoc-commons/model/records/gdoc-record';
import {ActivatedRoute} from '@angular/router';
import {GeoDocSearchForm} from '../../../../shared/gdoc-commons/model/forms/gdoc-searchform';
import {GeoDocSearchResult} from '../../../../shared/gdoc-commons/model/container/gdoc-searchresult';
import {GeoDocSearchFormConverter} from '../../../shared-gdoc/services/gdoc-searchform-converter.service';
import {ToastrService} from 'ngx-toastr';
import {LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {ErrorResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/error.resolver';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import * as L from 'leaflet';
import {GenericTrackingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/generic-tracking.service';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';
import {MapElement} from '@dps/mycms-frontend-commons/dist/angular-maps/services/leaflet-geo.plugin';
import {
    CommonDocSearchpageComponent,
    CommonDocSearchpageComponentConfig
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-searchpage.component';
import {GeoDocRoutingService} from '../../../../shared/gdoc-commons/services/gdoc-routing.service';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {environment} from '../../../../environments/environment';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {GeoDocActionTagService} from '../../../shared-gdoc/services/gdoc-actiontag.service';
import {GeoDocSearchFormUtils} from '../../../shared-gdoc/services/gdoc-searchform-utils.service';
import {CommonDocMultiActionManager} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-multiaction.manager';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';

@Component({
    selector: 'app-gdoc-searchpage',
    templateUrl: './gdoc-searchpage.component.html',
    styleUrls: ['./gdoc-searchpage.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeoDocSearchpageComponent extends CommonDocSearchpageComponent<GeoDocRecord, GeoDocSearchForm, GeoDocSearchResult,
    GeoDocDataService> {
    mapCenterPos: L.LatLng = undefined;
    mapZoom = 9;
    mapElements: MapElement[] = [];
    profileMapElements: MapElement[] = [];
    currentMapGDocId = undefined;
    flgShowMap = false;
    flgShowProfileMap = false;
    flgMapAvailable = false;
    flgProfileMapAvailable = false;

    constructor(route: ActivatedRoute, commonRoutingService: CommonRoutingService, errorResolver: ErrorResolver,
                gdocDataService: GeoDocDataService, searchFormConverter: GeoDocSearchFormConverter,
                cdocRoutingService: GeoDocRoutingService, toastr: ToastrService, pageUtils: PageUtils,
                cd: ChangeDetectorRef, trackingProvider: GenericTrackingService, appService: GenericAppService,
                platformService: PlatformService, layoutService: LayoutService, searchFormUtils: SearchFormUtils,
                gdocSearchFormUtils: GeoDocSearchFormUtils, protected actionService: GeoDocActionTagService,
                protected elRef: ElementRef) {
        super(route, commonRoutingService, errorResolver, gdocDataService, searchFormConverter, cdocRoutingService,
            toastr, pageUtils, cd, trackingProvider, appService, platformService, layoutService, searchFormUtils,
            gdocSearchFormUtils, new CommonDocMultiActionManager(appService, actionService), environment);
    }

    onMapGeoDocClicked(gdoc: GeoDocRecord) {
        console.log("gdocClicked", gdoc);
    }

    onMapCenterChanged(newCenter: L.LatLng) {
        console.log("newCenter", newCenter);
    }

    onMapElementsFound(mapElements: MapElement[]) {
        this.mapElements = [];
        this.mapElements = mapElements;
        this.flgMapAvailable = this.mapElements.length > 0;
        this.flgProfileMapAvailable = this.flgProfileMapAvailable && this.flgMapAvailable;
        this.flgShowMap = this.flgMapAvailable && this.flgShowMap;
        this.calcShowMaps();
        this.cd.markForCheck();

        return false;
    }

    onProfileMapElementsFound(mapElements: MapElement[]) {
        this.profileMapElements = mapElements;
        this.flgProfileMapAvailable = this.profileMapElements.length > 0;
        this.flgShowProfileMap = this.flgProfileMapAvailable && this.flgShowProfileMap;
        this.calcShowMaps();
        this.cd.markForCheck();

        return false;
    }


    onShowItemOnMap(gdoc: GeoDocRecord) {
        this.currentMapGDocId = undefined;
        if (gdoc) {
            this.currentMapGDocId = gdoc.id;
            this.pageUtils.scrollToTopOfElement(this.elRef);
            this.cd.markForCheck();
        }
    }

    protected getComponentConfig(config: {}): CommonDocSearchpageComponentConfig {
        return {
            baseSearchUrl: ['gdoc'].join('/'),
            baseSearchUrlDefault: ['gdoc'].join('/'),
            availableCreateActionTypes: [],
            maxAllowedM3UExportItems: BeanUtils.getValue(config, 'services.serverItemExport.maxAllowedM3UItems')
        };
    }

    protected doProcessAfterResolvedData(config: {}): void {
        if (this.searchForm.nearby !== undefined && this.searchForm.nearby.length > 0) {
            const [lat, lon] = this.searchForm.nearby.split('_');
            this.mapCenterPos = new L.LatLng(+lat, +lon);
        } else {
            this.mapCenterPos = undefined;
        }
    }

    protected doPreChecksBeforeSearch(): boolean {
        if (this.searchForm.sort === 'distance' && (this.searchForm.nearby === undefined || this.searchForm.nearby === '')) {
            // console.log('doSearch: redirect because of sort/nearby form:', this.searchForm);
            this.searchForm.sort = 'relevance';
            this.sort = 'relvance';
            return this.redirectToSearch();
        }

        return super.doPreChecksBeforeSearch();
    }

    protected doCheckSearchResultAfterSearch(searchResult: GeoDocSearchResult): void {
        super.doCheckSearchResultAfterSearch(searchResult);

        if (searchResult === undefined) {
            // console.log('empty searchResult', gdocSearchResult);
            this.flgMapAvailable = false;
            this.flgProfileMapAvailable = false;
            this.flgShowProfileMap = this.flgProfileMapAvailable;
        } else {
            // console.log('update searchResult', gdocSearchResult);
            this.flgMapAvailable = this.mapCenterPos !== undefined || this.searchResult.recordCount > 0;
            this.flgProfileMapAvailable = this.flgMapAvailable;
        }

        this.flgShowMap = this.flgMapAvailable;
        this.flgShowProfileMap = this.flgShowProfileMap && this.flgProfileMapAvailable;
        this.calcShowMaps();
    }

    private calcShowMaps() {
        if (this.layoutService.isSpider() || this.layoutService.isServer()) {
            this.flgShowProfileMap = false;
            this.flgShowMap = false;
            return;
        }
        if (!this.flgProfileMapAvailable) {
            this.flgShowProfileMap = false;
            return;
        }
        if (!this.layoutService.isDesktop() && this.profileMapElements && this.profileMapElements.length > 10) {
            this.flgShowProfileMap = false;
            return;
        }
    }
}
