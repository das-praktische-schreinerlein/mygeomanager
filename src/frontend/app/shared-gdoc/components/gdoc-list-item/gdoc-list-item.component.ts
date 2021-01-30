import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {CommonDocListItemComponent} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-list-item/cdoc-list-item.component';
import {GeoDocContentUtils} from '../../services/gdoc-contentutils.service';
import {GeoDocRecord} from '../../../../shared/gdoc-commons/model/records/gdoc-record';
import {CommonDocRecord} from '@dps/mycms-commons/dist/search-commons/model/records/cdoc-entity-record';

@Component({
    selector: 'app-gdoc-list-item',
    templateUrl: './gdoc-list-item.component.html',
    styleUrls: ['./gdoc-list-item.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeoDocListItemComponent  extends CommonDocListItemComponent {
    protected mapFlagSymbol = '&#128681';
    protected mapFlagAvailable = false;

    @Input()
    public showItemMapFlag?: false;

    @Output()
    public showItemOnMap: EventEmitter<CommonDocRecord> = new EventEmitter();


    constructor(contentUtils: GeoDocContentUtils, cd: ChangeDetectorRef, layoutService: LayoutService) {
        super(contentUtils, cd, layoutService);
        this.listLayoutName = 'default';
    }

    public submitShowItemOnMap(gdoc: GeoDocRecord) {
        this.showItemOnMap.emit(gdoc);
        return false;
    }

    protected updateData() {
        const gdocRecord: GeoDocRecord = <GeoDocRecord>this.record;
        if (gdocRecord && this.showItemMapFlag && (gdocRecord.geoLat || gdocRecord.gpsTrackSrc || gdocRecord.gpsTrackBasefile)) {
            this.mapFlagAvailable = true;
        } else {
            this.mapFlagAvailable = false;
        }
        super.updateData();
        this.cd.markForCheck();
    }
}
