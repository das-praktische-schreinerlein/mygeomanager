import {Injectable} from '@angular/core';
import {AngularHtmlService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-html.service';
import {HtmlMermaidRenderer} from '@dps/mycms-frontend-commons/dist/angular-commons/htmlrenderer/html-mermaid.renderer';
import {HtmlLocalLinkRenderer} from '@dps/mycms-frontend-commons/dist/angular-commons/htmlrenderer/html-locallink.renderer';
import {HtmlTogglerRenderer} from '@dps/mycms-frontend-commons/dist/angular-commons/htmlrenderer/html-toggler.renderer';

@Injectable()
export class SpecificAngularHtmlService extends AngularHtmlService {
    constructor(protected htmlLocalLinkRenderer: HtmlLocalLinkRenderer,
                protected htmlMermaidRenderer: HtmlMermaidRenderer,  // TODO remove mermaid if not used to minimize build-size
                protected htmlTogglerRenderer: HtmlTogglerRenderer) {
        super([htmlLocalLinkRenderer, htmlMermaidRenderer, htmlTogglerRenderer]);
    }
}
