import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SectionsPDocRecordResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/sections-pdoc-details.resolver';
import {SectionsBaseUrlResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/sections-baseurl.resolver';
import {SectionBarComponent} from '@dps/mycms-frontend-commons/dist/frontend-pdoc-commons/components/sectionbar/sectionbar.component';
import {SectionComponent} from '@dps/mycms-frontend-commons/dist/frontend-pdoc-commons/components/section/section.component';
import {SectionPageComponent} from '@dps/mycms-frontend-commons/dist/frontend-pdoc-commons/components/sectionpage/section-page.component';

const sectionRoutes: Routes = [
    {
        path: 'sections',
        children: [
            {
                path: ':section',
                component: SectionComponent,
                children: [
                    {
                        path: '',
                        outlet: 'sectionbar',
                        component: SectionBarComponent,
                        resolve: {
                            pdoc: SectionsPDocRecordResolver
                        }
                    },
                    {
                        path: '',
                        pathMatch: 'full',
                        component: SectionPageComponent,
                        data: {
                            id: 'sections_section',
                        },
                        resolve: {
                            pdoc: SectionsPDocRecordResolver,
                            baseSearchUrl: SectionsBaseUrlResolver
                        },
                    }
                ]
            }
        ]
    },
    {
        path: 'pages',
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'pages/start'
            },
            {
                path: ':section',
                component: SectionComponent,
                children: [
                    {
                        path: '',
                        outlet: 'sectionbar',
                        component: SectionBarComponent,
                        resolve: {
                            pdoc: SectionsPDocRecordResolver
                        }
                    },
                    {
                        path: '',
                        pathMatch: 'full',
                        component: SectionPageComponent,
                        data: {
                            id: 'sections_section',
                        },
                        resolve: {
                            pdoc: SectionsPDocRecordResolver,
                            baseSearchUrl: SectionsBaseUrlResolver
                        },
                    }
                ]
            },
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(sectionRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class SectionsRoutingModule {}
