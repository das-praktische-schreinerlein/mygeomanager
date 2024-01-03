import {NgModule} from '@angular/core';
import {AppComponent} from './components/app/app.component';
import {AppCommonModule} from './app.common.module';
import {HashLocationStrategy, LocationStrategy, registerLocaleData} from '@angular/common';
import localeDe from '@angular/common/locales/de';
import {AngularMarkdownService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-markdown.service';
import {SpecificAngularMarkdownService} from './services/specific-angular-markdown.service';
import {AngularHtmlService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-html.service';
import {SpecificAngularHtmlService} from './services/specific-angular-html.service';
import {HtmlMermaidRenderer} from '@dps/mycms-frontend-commons/dist/angular-commons/htmlrenderer/html-mermaid.renderer';
import {HtmlLocalLinkRenderer} from '@dps/mycms-frontend-commons/dist/angular-commons/htmlrenderer/html-locallink.renderer';
import {
    HtmlTogglerRenderer,
    SimpleHtmlTogglerRenderer
} from '@dps/mycms-frontend-commons/dist/angular-commons/htmlrenderer/html-toggler.renderer';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {AppService} from './services/app.service';
import {MarkdownPadModule} from './mdpad/mdpad.module';
import {PdfGenerator} from '@dps/mycms-frontend-commons/dist/angular-commons/services/pdf-print.service';
import {JsPdfGenerator} from '@dps/mycms-frontend-commons/dist/angular-commons/services/jspdf.generator';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {FallbackHttpClient} from './services/fallback-http-client';
import {createTranslateLoader} from './app.viewer.module';
import {RouterModule, Routes} from '@angular/router';

registerLocaleData(localeDe);

export const mdpadRoutes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/mdpad/editor'
    }
];


@NgModule({
    imports: [
        RouterModule.forChild(mdpadRoutes),
    ],
    exports: [
        RouterModule
    ]
})
export class AppMdPadFirstRoutingModule {}

@NgModule({
    imports: [
        RouterModule.forRoot(mdpadRoutes, // must be imported last !!!!
            { enableTracing: true } // <-- debugging purposes only
        ),
    ],
    exports: [
        RouterModule
    ]
})
export class AppMdPadGlobalRoutingModule {}

@NgModule({
    entryComponents: [
    ],
    imports: [
        AppMdPadFirstRoutingModule,
        AppCommonModule,
        MarkdownPadModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [FallbackHttpClient]
            }
        }),
        AppMdPadGlobalRoutingModule
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        {provide: GenericAppService, useClass: AppService},
        {provide: PdfGenerator, useClass: JsPdfGenerator},
        {provide: AngularMarkdownService, useClass: SpecificAngularMarkdownService},
        {provide: AngularHtmlService, useClass: SpecificAngularHtmlService},
        HtmlLocalLinkRenderer,
        HtmlMermaidRenderer,
        {provide: HtmlTogglerRenderer, useClass: SimpleHtmlTogglerRenderer},
    ],
    // Since the bootstrapped component is not inherited from your
    // imported AppModule, it needs to be repeated here.
    bootstrap: [AppComponent]
})
export class AppMdPadModule {}
