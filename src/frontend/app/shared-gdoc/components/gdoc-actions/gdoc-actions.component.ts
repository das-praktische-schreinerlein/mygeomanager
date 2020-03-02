import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {GeoDocRecord} from '../../../../shared/gdoc-commons/model/records/gdoc-record';
import {GeoDocDynamicComponentService} from '../../services/gdoc-dynamic-components.service';
import {GeoDocDataService} from '../../../../shared/gdoc-commons/services/gdoc-data.service';
import {ToastrService} from 'ngx-toastr';
import {
    CommonDocActionsComponent
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-actions/cdoc-actions.component';
import {GeoDocSearchForm} from '../../../../shared/gdoc-commons/model/forms/gdoc-searchform';
import {GeoDocSearchResult} from '../../../../shared/gdoc-commons/model/container/gdoc-searchresult';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {GeoDocActionTagService} from '../../services/gdoc-actiontag.service';

@Component({
    selector: 'app-gdoc-action',
    templateUrl: './../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-actions/cdoc-actions.component.html',
    styleUrls: ['./../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-actions/cdoc-actions.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeoDocActionsComponent extends CommonDocActionsComponent<GeoDocRecord, GeoDocSearchForm, GeoDocSearchResult, GeoDocDataService> {
    constructor(protected dynamicComponentService: GeoDocDynamicComponentService,
                protected toastr: ToastrService,
                protected cd: ChangeDetectorRef, protected appService: GenericAppService,
                protected actionTagService: GeoDocActionTagService) {
        super(dynamicComponentService, toastr, cd, appService, actionTagService);
    }
}
