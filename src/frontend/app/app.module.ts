import {NgModule} from '@angular/core';
import {AppComponent} from './components/app/app.component';
import {AppService} from './services/app.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NavbarComponent} from './components/navbar/navbar.component';
import {ToastrModule} from 'ngx-toastr';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {AppRoutingModule} from './app.router';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {SearchParameterUtils} from '@dps/mycms-commons/dist/search-commons/services/searchparameter.utils';
import {SectionsModule} from '@dps/mycms-frontend-commons/dist/frontend-pdoc-module/sections.module';
//import {SectionsModule} from './sections/sections.module';
import {PDocDataService} from '@dps/mycms-commons/dist/pdoc-commons/services/pdoc-data.service';
import {PDocDataStore} from '@dps/mycms-commons/dist/pdoc-commons/services/pdoc-data.store';
import {BrowserModule} from '@angular/platform-browser';
import {ErrorPageComponent} from './components/errorpage/errorpage.component';
import {AngularCommonsModule} from '@dps/mycms-frontend-commons/dist/angular-commons/angular-commons.module';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {BackendHttpClient} from './services/backend-http-client';
import {MinimalHttpBackendClient} from '@dps/mycms-commons/dist/commons/services/minimal-http-backend-client';
import {AngularHtmlService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-html.service';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {GenericTrackingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/generic-tracking.service';
import {TrackingService} from './services/tracking.service';
import {Angulartics2Module} from 'angulartics2';
import {registerLocaleData} from '@angular/common';
import localeDe from '@angular/common/locales/de';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';
import {DynamicComponentService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/dynamic-components.service';
import {LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {CookieLawModule} from 'angular2-cookie-law';
import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import {GeoDocModule} from './gdoc/gdoc.module';
import {GeoDocDynamicComponentService} from './shared-gdoc/services/gdoc-dynamic-components.service';
import {GeoDocDataService} from '../shared/gdoc-commons/services/gdoc-data.service';
import {GeoDocDataStore, GeoDocTeamFilterConfig} from '../shared/gdoc-commons/services/gdoc-data.store';
import {GeoDocAlbumService} from './shared-gdoc/services/gdoc-album.service';
import {GeoDocDataCacheService} from './shared-gdoc/services/gdoc-datacache.service';
import {GeoDocPlaylistService} from './shared-gdoc/services/gdoc-playlist.service';
import {GeoDocActionTagService} from './shared-gdoc/services/gdoc-actiontag.service';
import {GeoDocRoutingService} from '../shared/gdoc-commons/services/gdoc-routing.service';
import {GeoDocActionTagsComponent} from './shared-gdoc/components/gdoc-actiontags/gdoc-actiontags.component';

registerLocaleData(localeDe);

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient, platformService: PlatformService): TranslateHttpLoader {
    const url = platformService.getAssetsUrl('./assets/locales/locale-');
    // console.log('use translate-baseul', url);
    return new TranslateHttpLoader(http, url, '.json');
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
    entryComponents: [GeoDocActionTagsComponent],
    imports: [
        HttpClientModule,
        NgbModule.forRoot(),
        BrowserModule.withServerTransition({appId: 'pdoc-app'}),
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
        AppRoutingModule,
        CookieLawModule
    ],
    providers: [
        { provide: MinimalHttpBackendClient, useClass: BackendHttpClient },
        CommonRoutingService,
        { provide: GenericAppService, useClass: AppService },
        DynamicComponentService,
        GeoDocDynamicComponentService,
        GeoDocTeamFilterConfig,
        GeoDocDataStore,
        GeoDocDataService,
        PDocDataStore,
        GeoDocAlbumService,
        PDocDataService,
        GeoDocDataCacheService,
        SearchFormUtils,
        { provide: GenericTrackingService, useClass: TrackingService },
        AngularHtmlService,
        { provide: SearchParameterUtils, useClass: SearchParameterUtils },
        PageUtils,
        { provide: PlatformService, useClass: PlatformService},
        LayoutService,
        GeoDocActionTagService,
        GeoDocPlaylistService,
        GeoDocRoutingService,
        CommonDocRoutingService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
