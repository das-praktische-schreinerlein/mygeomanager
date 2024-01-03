import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MarkdownPadEditorPageComponent} from './components/mdpad-editorpage/mdpad-editorpage.component';

const mdPadRoutes: Routes = [
    {
        path: 'mdpad',
        children: [
            {
                path: 'editor',
                component: MarkdownPadEditorPageComponent
            },
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'mdpad/editor'
            },
            {
                path: '**',
                pathMatch: 'full',
                redirectTo: 'mdpad/editor'
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(mdPadRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class MarkdownPadRoutingModule {}
