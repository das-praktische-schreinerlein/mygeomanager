/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {RouterStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/router-stubs';
import {AppServiceStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/appservice-stubs';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';
import {LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {ToastrServiceStub} from '@dps/mycms-frontend-commons/dist/testing/toasts-stubs';
import {MarkdownPadEditorPageComponent} from './mdpad-editorpage.component';
import {ActivatedRouteStub} from '@dps/mycms-frontend-commons/dist/testing/router-stubs';
import {Angulartics2Stub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/angulartics2-stubs';
import {Angulartics2} from 'angulartics2';
import {GenericTrackingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/generic-tracking.service';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {COMMON_APP_ENVIRONMENT} from '@dps/mycms-frontend-commons/dist/frontend-section-commons/common-environment';
import {PrintService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/print.service';
import {SimplePrintService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/simple-print.service';
import {PdfGenerator, PdfPrintService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/pdf-print.service';
import {PrintDialogPdfGenerator} from '@dps/mycms-frontend-commons/dist/angular-commons/services/print-dialog-pdf.generator';
import {SimplePdfPrintService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/simple-pdf-print.service';

describe('MarkdownPadEditorPageComponent', () => {
    let component: MarkdownPadEditorPageComponent;
    let fixture: ComponentFixture<MarkdownPadEditorPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MarkdownPadEditorPageComponent],
            imports: [
                NgbModule.forRoot(),
                TranslateModule.forRoot(),
                NoopAnimationsModule
            ],
            providers: [
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                { provide: Router, useValue: new RouterStub() },
                { provide: GenericAppService, useValue: new AppServiceStub() },
                { provide: ToastrService, useValue: new ToastrServiceStub() },
                GenericTrackingService,
                { provide: Angulartics2, useValue: new Angulartics2Stub() },
                CommonRoutingService,
                TranslateService,
                PageUtils,
                PlatformService,
                LayoutService,
                { provide: COMMON_APP_ENVIRONMENT, useValue: {}},
                {provide: PrintService, useClass: SimplePrintService},
                {provide: PdfGenerator, useClass: PrintDialogPdfGenerator},
                {provide: PdfPrintService, useClass: SimplePdfPrintService}
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MarkdownPadEditorPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
