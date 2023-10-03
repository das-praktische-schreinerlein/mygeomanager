import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {GeoDocListComponent} from './components/gdoc-list/gdoc-list.component';
import {GeoDocListItemComponent} from './components/gdoc-list-item/gdoc-list-item.component';
import {GeoDocSearchformComponent} from './components/gdoc-searchform/gdoc-searchform.component';
import {GeoDocInlineSearchpageComponent} from './components/gdoc-inline-searchpage/gdoc-inline-searchpage.component';
import {AngularMapsModule} from '@dps/mycms-frontend-commons/dist/angular-maps/angular-maps.module';
import {AngularCommonsModule} from '@dps/mycms-frontend-commons/dist/angular-commons/angular-commons.module';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateModule} from '@ngx-translate/core';
import {MultiselectDropdownModule} from 'angular-2-dropdown-multiselect';
import {NgbAccordionModule, NgbRatingModule, NgbTabsetModule} from '@ng-bootstrap/ng-bootstrap';
import {ToastrModule} from 'ngx-toastr';
import {LightboxModule} from 'ngx-lightbox';
import {
    GeoDocLinkedLocHierarchyComponent
} from './components/gdoc-linked-loc-hierarchy/gdoc-linked-loc-hierarchy.component';
import {GeoDocDataTechComponent} from './components/gdoc-datatech/gdoc-datatech.component';
import {GeoDocDistanceComponent} from './components/gdoc-distance/gdoc-distance.component';
import {GeoDocDateFormatPipe} from './pipes/gdoc-dateformat.pipe';
import {DatePipe} from '@angular/common';
import {GeoDocDataMetaComponent} from './components/gdoc-datameta/gdoc-datameta.component';
import {GeoDocActionsComponent} from './components/gdoc-actions/gdoc-actions.component';
import {GeoDocActionTagsComponent} from './components/gdoc-actiontags/gdoc-actiontags.component';
import {FileDropModule} from 'ngx-file-drop';
import {
    FrontendCommonDocCommonsModule
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/frontend-cdoc-commons.module';
import {GeoDocKeywordsComponent} from './components/gdoc-keywords/gdoc-keywords.component';
import {GeoDocMultiActionHeaderComponent} from './components/gdoc-multiactionheader/gdoc-multiactionheader.component';
import {GeoDocListItemSmallComponent} from './components/gdoc-list-item-small/gdoc-list-item-small.component';
import {GeoDocListItemFlatComponent} from './components/gdoc-list-item-flat/gdoc-list-item-flat.component';
import {GeoDocListItemPageComponent} from './components/gdoc-list-item-page/gdoc-list-item-page.component';
import {GeoDocListItemThinComponent} from './components/gdoc-list-item-thin/gdoc-list-item-thin.component';
import {GeoDocMapCodePipe} from './pipes/gdoc-mapcode.pipe';
import {RouterModule} from '@angular/router';

@NgModule({
    declarations: [
        GeoDocListComponent,
        GeoDocListItemComponent,
        GeoDocListItemSmallComponent,
        GeoDocListItemFlatComponent,
        GeoDocListItemPageComponent,
        GeoDocListItemThinComponent,
        GeoDocSearchformComponent,
        GeoDocInlineSearchpageComponent,
        GeoDocInlineSearchpageComponent,
        GeoDocLinkedLocHierarchyComponent,
        GeoDocDataTechComponent,
        GeoDocDataMetaComponent,
        GeoDocDistanceComponent,
        GeoDocDateFormatPipe,
        GeoDocMapCodePipe,
        GeoDocActionsComponent,
        GeoDocActionTagsComponent,
        GeoDocKeywordsComponent,
        GeoDocMultiActionHeaderComponent
    ],
    imports: [
        NgbAccordionModule, NgbRatingModule, NgbTabsetModule,
        ToastrModule,
        MultiselectDropdownModule,
        TranslateModule,
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        AngularCommonsModule,
        AngularMapsModule,
        FrontendCommonDocCommonsModule,
        LightboxModule,
        FileDropModule,
        RouterModule
    ],
    providers: [
        DatePipe
    ],
    exports: [
        GeoDocListComponent,
        GeoDocListItemComponent,
        GeoDocListItemSmallComponent,
        GeoDocListItemFlatComponent,
        GeoDocListItemPageComponent,
        GeoDocListItemThinComponent,
        GeoDocSearchformComponent,
        GeoDocInlineSearchpageComponent,
        GeoDocInlineSearchpageComponent,
        GeoDocLinkedLocHierarchyComponent,
        GeoDocDataTechComponent,
        GeoDocDataMetaComponent,
        GeoDocDistanceComponent,
        GeoDocDateFormatPipe,
        GeoDocMapCodePipe,
        GeoDocActionsComponent,
        GeoDocActionTagsComponent,
        GeoDocKeywordsComponent,
        GeoDocMultiActionHeaderComponent
    ]
})
export class SharedGeoDocModule {}
