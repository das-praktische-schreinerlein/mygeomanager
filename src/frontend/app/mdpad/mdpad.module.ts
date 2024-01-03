import {NgModule} from '@angular/core';
import {ToastrModule} from 'ngx-toastr';
import {BrowserModule} from '@angular/platform-browser';
import {AngularCommonsModule} from '@dps/mycms-frontend-commons/dist/angular-commons/angular-commons.module';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {AngularHtmlService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-html.service';
import {AngularMarkdownService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-markdown.service';
import {LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {
    HtmlTogglerRenderer,
    SimpleHtmlTogglerRenderer
} from '@dps/mycms-frontend-commons/dist/angular-commons/htmlrenderer/html-toggler.renderer';
import {HtmlLocalLinkRenderer} from '@dps/mycms-frontend-commons/dist/angular-commons/htmlrenderer/html-locallink.renderer';
import {SpecificAngularHtmlService} from '../services/specific-angular-html.service';
import {SpecificAngularMarkdownService} from '../services/specific-angular-markdown.service';
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
        LayoutService,
        {provide: AngularMarkdownService, useClass: SpecificAngularMarkdownService},
        {provide: AngularHtmlService, useClass: SpecificAngularHtmlService},
        HtmlLocalLinkRenderer,
        {provide: HtmlTogglerRenderer, useClass: SimpleHtmlTogglerRenderer}
    ],
    exports: [
    ]
})
export class MarkdownPadModule {}
