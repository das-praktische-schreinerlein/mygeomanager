import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {AppState, GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';
import {CommonDocRecord} from '@dps/mycms-commons/dist/search-commons/model/records/cdoc-entity-record';

@Component({
    selector: 'app-gdoc-keywords',
    templateUrl: 'gdoc-keywords.component.html',
    styleUrls: ['./../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-keywords/cdoc-keywords.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeoDocKeywordsComponent extends AbstractInlineComponent implements OnInit {
    @Input()
    public record: CommonDocRecord;

    constructor(protected appService: GenericAppService, protected cd: ChangeDetectorRef) {
        super(cd);
    }

    ngOnInit() {
        this.appService.getAppState().subscribe(appState => {
            if (appState === AppState.Ready) {
                this.updateData();
            }
        });
    }

    protected updateData() {
        this.cd.markForCheck();
    }
}
