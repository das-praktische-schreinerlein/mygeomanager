import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {GeoDocRecord} from '../../../../shared/gdoc-commons/model/records/gdoc-record';
import {GeoDocSearchResult} from '../../../../shared/gdoc-commons/model/container/gdoc-searchresult';
import {GeoDocSearchFormConverter} from '../../services/gdoc-searchform-converter.service';
import {GeoDocLightBoxService} from '../../services/gdoc-lightbox.service';
import {Layout} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {GeoDocSearchForm} from '../../../../shared/gdoc-commons/model/forms/gdoc-searchform';
import {CommonDocListComponent} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-list/cdoc-list.component';
import {CommonDocLightboxAlbumConfig} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-lightbox.service';
import {CommonDocRecord} from "@dps/mycms-commons/dist/search-commons/model/records/cdoc-entity-record";

@Component({
    selector: 'app-gdoc-list',
    templateUrl: './gdoc-list.component.html',
    styleUrls: ['./gdoc-list.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeoDocListComponent extends CommonDocListComponent<GeoDocRecord, GeoDocSearchForm, GeoDocSearchResult> {
    @Input()
    public showItemMapFlag?: false;

    @Output()
    public showItemOnMap: EventEmitter<CommonDocRecord> = new EventEmitter();

    @Output()
    public playerStarted: EventEmitter<GeoDocRecord> = new EventEmitter();

    @Output()
    public playerStopped: EventEmitter<GeoDocRecord> = new EventEmitter();

    public Layout = Layout;

    private lightboxAlbumConfig: CommonDocLightboxAlbumConfig = {
        album: [],
        idPos: {}
    };

    constructor(private searchFormConverter: GeoDocSearchFormConverter,
                private lightboxService: GeoDocLightBoxService, protected cd: ChangeDetectorRef) {
        super(cd);
    }

    onShowImage(record: GeoDocRecord) {
        if (record.type === 'IMAGE') {
            this.lightboxService.openId(this.lightboxAlbumConfig, record.id);
        } else {
            this.show.emit(record);
        }
        return false;
    }

    onPlayerStarted(gdoc: GeoDocRecord) {
        this.playerStarted.emit(gdoc);
    }

    onPlayerStopped(gdoc: GeoDocRecord) {
        this.playerStopped.emit(gdoc);
    }

    onShowItemOnMap(gdoc: GeoDocRecord) {
        this.showItemOnMap.emit(gdoc);
    }

    getBackToSearchUrl(searchResult: GeoDocSearchResult): string {
        return (searchResult.searchForm ?
            this.searchFormConverter.searchFormToUrl(this.baseSearchUrl, searchResult.searchForm) : undefined);
    }

    protected updateData(): void {
        this.lightboxAlbumConfig = this.lightboxService.createAlbumConfig(this.searchResult);
    }
}
