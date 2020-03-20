/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {GeoDocListItemSmallComponent} from './gdoc-list-item-small.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import {TranslateModule} from '@ngx-translate/core';
import {CommonDocContentUtils} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-contentutils.service';
import {AppServiceStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/appservice-stubs';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {RouterStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/router-stubs';
import {GeoDocDateFormatPipe} from '../../pipes/gdoc-dateformat.pipe';
import {DatePipe} from '@angular/common';
import {CommonDocDataServiceStub} from '@dps/mycms-frontend-commons/dist/testing/cdoc-dataservice-stubs';
import {LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {GeoDocContentUtils} from '../../services/gdoc-contentutils.service';
import {GeoDocMapCodePipe} from "../../pipes/gdoc-mapcode.pipe";

describe('GeoDocListItemSmallComponent', () => {
    let component: GeoDocListItemSmallComponent;
    let fixture: ComponentFixture<GeoDocListItemSmallComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GeoDocListItemSmallComponent, GeoDocDateFormatPipe, GeoDocMapCodePipe],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                CommonRoutingService,
                CommonDocRoutingService,
                CommonDocContentUtils,
                GeoDocContentUtils,
                DatePipe,
                LayoutService,
                { provide: GenericAppService, useValue: new AppServiceStub() }
            ],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [NgbModule.forRoot(),
                TranslateModule.forRoot()]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GeoDocListItemSmallComponent);
        component = fixture.componentInstance;
        component.record = CommonDocDataServiceStub.defaultRecord();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
