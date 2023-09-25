import {AppComponent} from './components/app/app.component';
import {NgbCollapseModule, NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import {NavbarComponent} from './components/navbar/navbar.component';
import {ToastrModule} from 'ngx-toastr';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {SearchParameterUtils} from '@dps/mycms-commons/dist/search-commons/services/searchparameter.utils';
import {SectionsModule} from './sections/sections.module';
import {StaticPagesDataService} from '@dps/mycms-commons/dist/pdoc-commons/services/staticpages-data.service';
import {StaticPagesDataStore} from '@dps/mycms-commons/dist/pdoc-commons/services/staticpages-data.store';
import {BrowserModule} from '@angular/platform-browser';
import {ErrorPageComponent} from './components/errorpage/errorpage.component';
import {AngularCommonsModule} from '@dps/mycms-frontend-commons/dist/angular-commons/angular-commons.module';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {BackendHttpClient} from './services/backend-http-client';
import {MinimalHttpBackendClient} from '@dps/mycms-commons/dist/commons/services/minimal-http-backend-client';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {
    GenericTrackingService
} from '@dps/mycms-frontend-commons/dist/angular-commons/services/generic-tracking.service';
import {TrackingService} from './services/tracking.service';
import {Angulartics2Module} from 'angulartics2';
import {registerLocaleData} from '@angular/common';
import localeDe from '@angular/common/locales/de';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';
import {
    DynamicComponentService
} from '@dps/mycms-frontend-commons/dist/angular-commons/services/dynamic-components.service';
import {LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {CookieLawModule} from 'angular2-cookie-law';
import {environment} from '../environments/environment';
import {FallbackHttpClient} from './services/fallback-http-client';
import {NgModule} from '@angular/core';
import {AppCommonRoutingModule} from './app.common.router';
import {GeoDocDataStore, GeoDocTeamFilterConfig} from '../shared/gdoc-commons/services/gdoc-data.store';
import {GeoDocModule} from './gdoc/gdoc.module';
import {GeoDocDataService} from '../shared/gdoc-commons/services/gdoc-data.service';
import {GeoDocDynamicComponentService} from './shared-gdoc/services/gdoc-dynamic-components.service';
import {GeoDocAlbumService} from './shared-gdoc/services/gdoc-album.service';
import {GeoDocDataCacheService} from './shared-gdoc/services/gdoc-datacache.service';
import {GeoDocActionTagService} from './shared-gdoc/services/gdoc-actiontag.service';
import {GeoDocPlaylistService} from './shared-gdoc/services/gdoc-playlist.service';
import {GeoDocActionTagsComponent} from './shared-gdoc/components/gdoc-actiontags/gdoc-actiontags.component';
import {
    CommonDocRoutingService
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import {PDocDataService} from '@dps/mycms-commons/dist/pdoc-commons/services/pdoc-data.service';
import {PDocDataStore} from '@dps/mycms-commons/dist/pdoc-commons/services/pdoc-data.store';
import {PrintService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/print.service';
import {SimplePrintService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/simple-print.service';
import {
    PdfGenerator,
    PdfPrintService
} from '@dps/mycms-frontend-commons/dist/angular-commons/services/pdf-print.service';
import {
    SimplePdfPrintService
} from '@dps/mycms-frontend-commons/dist/angular-commons/services/simple-pdf-print.service';
import {
    PrintDialogPdfGenerator
} from '@dps/mycms-frontend-commons/dist/angular-commons/services/print-dialog-pdf.generator';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {AppService} from './services/app.service';

registerLocaleData(localeDe);

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient, platformService: PlatformService): TranslateHttpLoader {
    const url = platformService.getAssetsUrl('./assets/locales/locale-');
    // console.log('use translate-baseul', url);
    return new TranslateHttpLoader(http, url,  environment.assetsPathVersionSnippet + '.json' + environment.assetsPathVersionSuffix);
}

export function getAngulartics2Providers(): any {
    return TrackingService.getTrackingProvider();
}

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        ErrorPageComponent
    ],
    entryComponents: [
        GeoDocActionTagsComponent
    ],
    imports: [
        HttpClientModule,
        NgbCollapseModule, NgbDropdownModule,
        BrowserModule.withServerTransition({appId: 'gdoc-app'}),
        ToastrModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient, PlatformService]
            }
        }),
        Angulartics2Module.forRoot(getAngulartics2Providers()),
        AngularCommonsModule,
        GeoDocModule,
        SectionsModule,
        CookieLawModule,
        AppCommonRoutingModule
    ],
    providers: [
        {provide: MinimalHttpBackendClient, useClass: BackendHttpClient},
        // customUrlSerializerProvider, // activate this to get parenthes in parameters running, but then suburls dont run anymore
        CommonRoutingService,
        {provide: GenericAppService, useClass: AppService},
        CommonDocRoutingService,
        FallbackHttpClient,
        DynamicComponentService,
        GeoDocDynamicComponentService,
        GeoDocTeamFilterConfig,
        GeoDocDataStore,
        GeoDocDataService,
        PDocDataStore,
        GeoDocAlbumService,
        PDocDataService,
        StaticPagesDataStore,
        StaticPagesDataService,
        GeoDocDataCacheService,
        SearchFormUtils,
        {provide: GenericTrackingService, useClass: TrackingService},
        {provide: SearchParameterUtils, useClass: SearchParameterUtils},
        PageUtils,
        {provide: PlatformService, useClass: PlatformService},
        LayoutService,
        GeoDocActionTagService,
        GeoDocPlaylistService,
        {provide: PrintService, useClass: SimplePrintService},
        // TODO if you want pdf replace PrintDialogPdfGenerator by JsPdfGenerator and move jspdf in package.json from optional to dep
        {provide: PdfGenerator, useClass: PrintDialogPdfGenerator},
        {provide: PdfPrintService, useClass: SimplePdfPrintService}
    ],
    bootstrap: [AppComponent]
})
export class AppCommonModule {
}
