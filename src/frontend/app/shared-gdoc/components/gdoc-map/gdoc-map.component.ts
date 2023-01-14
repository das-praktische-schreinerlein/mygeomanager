import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';

import {GeoDocRecord} from '../../../../shared/gdoc-commons/model/records/gdoc-record';
import {MapElement} from '@dps/mycms-frontend-commons/dist/angular-maps/services/leaflet-geo.plugin';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';
import {GeoDocContentUtils} from '../../services/gdoc-contentutils.service';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';
import {StringUtils} from '@dps/mycms-commons/dist/commons/utils/string.utils';

@Component({
    selector: 'app-gdoc-map',
    templateUrl: './gdoc-map.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeoDocMapComponent extends AbstractInlineComponent {
    showLoadingSpinner = false;
    mapElements: MapElement[] = [];
    centerOnMapElements: MapElement[] = undefined;
    mapElementsReverseMap = new Map<MapElement, GeoDocRecord>();

    @Input()
    public mapId: string;

    @Input()
    public height: string;

    @Input()
    public gdocs: GeoDocRecord[];

    @Input()
    public currentGDocId?: string;

    @Input()
    public mapCenterPos: L.LatLng;

    @Input()
    public mapZoom: number;

    @Input()
    public showImageTrackAndGeoPos? = false;

    @Output()
    public centerChanged: EventEmitter<L.LatLng> = new EventEmitter();

    @Output()
    public gdocClicked: EventEmitter<GeoDocRecord> = new EventEmitter();

    @Output()
    public mapElementsFound: EventEmitter<MapElement[]> = new EventEmitter();

    constructor(private contentUtils: GeoDocContentUtils, protected cd: ChangeDetectorRef,
                private platformService: PlatformService) {
        super(cd);
    }

    onTrackClicked(mapElement: MapElement) {
        this.gdocClicked.emit(this.mapElementsReverseMap.get(mapElement));
    }

    onMapElementsLoaded(mapElements: MapElement[]) {
        this.showLoadingSpinner = false;
        this.cd.detectChanges();
    }

    renderMap() {
        this.mapElementsReverseMap.clear();
        this.centerOnMapElements = undefined;
        if (!this.gdocs) {
            this.mapElements = [];
            this.showLoadingSpinner = false;
            return;
        }

        this.showLoadingSpinner = (this.gdocs.length > 0);
        for (let i = 0; i < this.gdocs.length; i++) {
            const record =  this.gdocs[i];

            for (const mapElement of this.contentUtils.createMapElementForGeoDoc(record,
                StringUtils.calcCharCodeForListIndex(i + 1), this.showImageTrackAndGeoPos)) {
                if (record.id === this.currentGDocId) {
                    mapElement.color = 'red';
                    this.centerOnMapElements = [mapElement];
                }
                this.mapElementsReverseMap.set(mapElement, record);
            }
        }
        this.mapElements = Array.from(this.mapElementsReverseMap.keys());
        this.mapElementsFound.emit(this.mapElements);

        this.cd.markForCheck();
    }

    protected updateData(): void {
        if (this.platformService.isClient()) {
            this.renderMap();
        }
    }
}
