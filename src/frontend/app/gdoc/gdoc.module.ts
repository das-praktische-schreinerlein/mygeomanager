import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {GeoDocSearchpageComponent} from './components/gdoc-searchpage/gdoc-searchpage.component';
import {GeoDocSearchFormConverter} from '../shared-gdoc/services/gdoc-searchform-converter.service';
import {GeoDocShowpageComponent} from './components/gdoc-showpage/gdoc-showpage.component';
import {
    CommonDocRoutingService
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import {GeoDocSearchFormUtils} from '../shared-gdoc/services/gdoc-searchform-utils.service';
import {GeoDocSearchFormResolver} from '../shared-gdoc/resolver/gdoc-searchform.resolver';
import {GeoDocRecordResolver} from '../shared-gdoc/resolver/gdoc-details.resolver';
import {GeoDocRoutingModule} from './gdoc-routing.module';
import {ToastrModule} from 'ngx-toastr';
import {SearchParameterUtils} from '@dps/mycms-commons/dist/search-commons/services/searchparameter.utils';
import {
    CommonDocContentUtils
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-contentutils.service';
import {SharedGeoDocModule} from '../shared-gdoc/shared-gdoc.module';
import {BrowserModule} from '@angular/platform-browser';
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {AngularCommonsModule} from '@dps/mycms-frontend-commons/dist/angular-commons/angular-commons.module';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {ErrorResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/error.resolver';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {GeoDocLightBoxService} from '../shared-gdoc/services/gdoc-lightbox.service';
import {AngularHtmlService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-html.service';
import {
    AngularMarkdownService
} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-markdown.service';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {GeoDocAlbumResolver} from '../shared-gdoc/resolver/gdoc-album.resolver';
import {GeoDocAlbumpageComponent} from './components/gdoc-albumpage/gdoc-albumpage.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {GeoDocDataService} from '../../shared/gdoc-commons/services/gdoc-data.service';
import {FileDropModule} from 'ngx-file-drop';
import {GeoDocContentUtils} from '../shared-gdoc/services/gdoc-contentutils.service';
import {
    CommonDocSearchFormUtils
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-searchform-utils.service';
import {
    FrontendCommonDocCommonsModule
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/frontend-cdoc-commons.module';
import {GeoDocRoutingService} from '../../shared/gdoc-commons/services/gdoc-routing.service';

@NgModule({
    declarations: [
        GeoDocSearchpageComponent,
        GeoDocShowpageComponent,
        GeoDocAlbumpageComponent
    ],
    imports: [
        NgbPaginationModule,
        TranslateModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        ToastrModule,
        HttpClientModule,
        AngularCommonsModule,
        SharedGeoDocModule,
        GeoDocRoutingModule,
        FileDropModule,
        FrontendCommonDocCommonsModule
    ],
    providers: [
        TranslateService,
        CommonRoutingService,
        GeoDocRoutingService,
        GeoDocSearchFormConverter,
        GeoDocDataService,
        { provide: CommonDocRoutingService, useClass: GeoDocRoutingService },
        GeoDocRoutingService,
        { provide: CommonDocSearchFormUtils, useClass: GeoDocSearchFormUtils },
        GeoDocSearchFormUtils,
        SearchParameterUtils,
        { provide: CommonDocContentUtils, useClass: GeoDocContentUtils },
        GeoDocContentUtils,
        GeoDocSearchFormResolver,
        GeoDocRecordResolver,
        ErrorResolver,
        PageUtils,
        GeoDocLightBoxService,
        AngularHtmlService,
        AngularMarkdownService,
        GeoDocAlbumResolver,
        LayoutService
    ],
    exports: [
        GeoDocSearchpageComponent
    ]
})
export class GeoDocModule {}
