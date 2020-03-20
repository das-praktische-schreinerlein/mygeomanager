import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {GeoDocRecord} from '../../../../shared/gdoc-commons/model/records/gdoc-record';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';
import {MapElement} from '@dps/mycms-frontend-commons/dist/angular-maps/services/leaflet-geo.plugin';
import {GeoDocContentUtils} from '../../services/gdoc-contentutils.service';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';
import {StringUtils} from "@dps/mycms-commons/dist/commons/utils/string.utils";

@Component({
    selector: 'app-gdoc-profilemap',
    templateUrl: './gdoc-profilemap.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeoDocProfileMapComponent extends AbstractInlineComponent {
    mapElements: MapElement[] = [];

    @Input()
    public mapId: string;

    @Input()
    public height: string;

    @Input()
    public gdocs: GeoDocRecord[];

    @Input()
    public showImageTrackAndGeoPos? = false;

    @Output()
    public mapElementsFound: EventEmitter<MapElement[]> = new EventEmitter();

    constructor(protected cd: ChangeDetectorRef, private contentUtils: GeoDocContentUtils, private appService: GenericAppService,
                private platformService: PlatformService) {
        super(cd);
    }

    renderMap() {
        if (!this.gdocs) {
            this.mapElements = [];
            return;
        }

        const tmpList: MapElement[] = [];
        for (let i = 0; i < this.gdocs.length; i++) {
            const record =  this.gdocs[i];
            for (const mapElement of this.contentUtils.createMapElementForGeoDoc(record,
                StringUtils.calcCharCodeForListIndex(i + 1), this.showImageTrackAndGeoPos)) {
                tmpList.push(mapElement);
            }
        }
        this.mapElements = tmpList;
        this.mapElementsFound.emit(this.mapElements);

        this.cd.markForCheck();
    }

    protected updateData(): void {
        if (this.platformService.isClient()) {
            this.renderMap();
        }
    }
}
