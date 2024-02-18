import {NgModule} from '@angular/core';
import {ToastrModule} from 'ngx-toastr';
import {BrowserModule} from '@angular/platform-browser';
import {AngularCommonsModule} from '@dps/mycms-frontend-commons/dist/angular-commons/angular-commons.module';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {MarkdownPadEditorPageComponent} from './components/mdpad-editorpage/mdpad-editorpage.component';
import {MarkdownPadRoutingModule} from './mdpad-routing.module';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';

@NgModule({
    declarations: [
        MarkdownPadEditorPageComponent
    ],
    imports: [
        TranslateModule,
        BrowserModule,
        ToastrModule,
        AngularCommonsModule,
        MarkdownPadRoutingModule
    ],
    providers: [
        TranslateService,
        CommonRoutingService,
        PageUtils,
        LayoutService
    ],
    exports: [
    ]
})
export class MarkdownPadModule {}
