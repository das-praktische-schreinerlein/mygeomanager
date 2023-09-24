import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Injectable, LOCALE_ID} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {environment} from '../../../environments/environment';
import {ToastrService} from 'ngx-toastr';
import {AbstractAppComponent} from '@dps/mycms-frontend-commons/dist/frontend-section-commons/components/abstract-app.component';
import {PrintOptions, PrintService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/print.service';
import {ElementFilterType} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.utils';
import {PdfPrintOptions, PdfPrintService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/pdf-print.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
@Injectable()
export class AppComponent {
    printAvailable: true;
    pdfPrintAvailable: true;
    showLoadingSpinner = true;
    title = 'MyGeoManager';
    showLaw = false;
    hideCopyrightFooter = environment.hideCopyrightFooter;
    cookieLawSeenName = environment.cookieLawSeenName;

    constructor(private appService: GenericAppService, private toastr: ToastrService,
                translate: TranslateService, private router: Router, @Inject(LOCALE_ID) locale: string,
                private http: HttpClient, private commonRoutingService: CommonRoutingService, private cd: ChangeDetectorRef,
                private platformService: PlatformService, private pageUtils: PageUtils, private layoutService: LayoutService) {
        // this language will be used as a fallback when a translation isn't found in the current language
        translate.setDefaultLang(locale);

    constructor(appService: GenericAppService, toastr: ToastrService,
                translate: TranslateService, router: Router, @Inject(LOCALE_ID) locale: string,
                http: HttpClient, commonRoutingService: CommonRoutingService, cd: ChangeDetectorRef,
                platformService: PlatformService, pageUtils: PageUtils, layoutService: LayoutService,
                protected printService: PrintService, protected pdfPrintService: PdfPrintService) {
        super(appService, toastr, translate, router, locale, http, commonRoutingService, cd, platformService, pageUtils, layoutService,
            environment);
    }

    onOpenPrintPreview(elementFilterType: ElementFilterType, filter: string, width?: number, height?: number,
                            printCssIdRegExp?: string) {
        const options: PrintOptions = {
            printElementFilter: {
                type: elementFilterType,
                value: filter
            },
            previewWindow: {
                width: width,
                height: height
            },
            printStyleIdFilter: new RegExp(printCssIdRegExp)
        };
        this.printService.openPrintPreview(options);

        return false;
    }

    onPrintPdf(elementFilterType: ElementFilterType, filter: string, width?: number, height?: number,
                    printCssIdRegExp?: string) {
        const options: PdfPrintOptions = {
            printElementFilter: {
                type: elementFilterType,
                value: filter
            },
            previewWindow: {
                width: width,
                height: height
            },
            printStyleIdFilter: new RegExp(printCssIdRegExp),
            fileName: 'filename.pdf',
            pdfOptions: {
                orientation: 'portrait',
                format: 'a4'
            },
            waitForRenderingMs: 1000
        };
        this.pdfPrintService.printPdf(options);

        return false;
    }

    onScrollToTop() {
        this.pageUtils.scrollToTop();
    }
}
