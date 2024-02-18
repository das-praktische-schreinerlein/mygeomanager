import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {GenericTrackingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/generic-tracking.service';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';
import {LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {environment} from '../../../../environments/environment';
import {AbstractPageComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/abstract-page.component';
import {PDocRecord} from '@dps/mycms-commons/dist/pdoc-commons/model/records/pdoc-record';
import {
    CommonDocEditorCommandComponentConfig
} from '@dps/mycms-frontend-commons/dist/angular-commons/components/text-editor/text-editor.component';
import {PdfPrintOptions, PdfPrintService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/pdf-print.service';
import {PrintOptions, PrintService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/print.service';
import {ElementFilterType} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.utils';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';
import {CommonRoutingService, RoutingState} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {NameUtils} from '@dps/mycms-commons/dist/commons/utils/name.utils';

export interface MarkdownPadEditorPageComponentConfig {
    editorCommands: CommonDocEditorCommandComponentConfig;
    sampleDesc: string;
}

@Component({
    selector: 'app-mdpad-editorpage',
    templateUrl: './mdpad-editorpage.component.html',
    styleUrls: ['./mdpad-editorpage.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarkdownPadEditorPageComponent
    extends AbstractPageComponent {

    editorCommands: CommonDocEditorCommandComponentConfig = {
        singleCommands: [],
        rangeCommands: [],
        commandBlocks: []
    };

    suggestedFileBase = 'document';
    currentDescMd = '';
    sampleDesc = '';
    renderedDescId: string = undefined;

    @ViewChild('editorTop')
    editorTop: ElementRef;

    constructor(route: ActivatedRoute, toastr: ToastrService, pageUtils: PageUtils, cd: ChangeDetectorRef,
                trackingProvider: GenericTrackingService, protected commonRoutingService: CommonRoutingService,
                appService: GenericAppService, platformService: PlatformService, layoutService: LayoutService,
                protected printService: PrintService, protected pdfPrintService: PdfPrintService) {
        super(route, toastr, pageUtils, cd, trackingProvider, appService, platformService, layoutService, environment);
    }

    setDesc(desc: string): void {
        this.currentDescMd = desc;
    }

    setRenderedDescId(renderedDescId: string): void {
        this.renderedDescId = renderedDescId;
    }

    onFileLoaded(fileName: string): void {
        const newFileBase = fileName.substring(0, fileName.lastIndexOf('.'));
        this.suggestedFileBase = NameUtils.normalizeFileNames(newFileBase !== undefined && newFileBase.length > 0
            ? newFileBase
            : this.suggestedFileBase);
    }

    isPdfPrintAvailable(): boolean {
        return this.pdfPrintService.isPrintPdfAvailable();
    }

    isPrintAvailable(): boolean {
        return this.printService.isPrintAvailable();
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
            fileName: this.suggestedFileBase + '.pdf',
            pdfOptions: {
                orientation: 'portrait',
                format: 'a4'
            },
            waitForRenderingMs: 1000
        };
        this.pdfPrintService.printPdf(options);

        return false;
    }

    protected getComponentConfig(config: {}): MarkdownPadEditorPageComponentConfig {
        const editorCommands: CommonDocEditorCommandComponentConfig = {
            rangeCommands: [],
            singleCommands: [],
            commandBlocks: []
        };
        let sampleDesc = '';

        if (BeanUtils.getValue(config, 'components.pdoc-editor-commands.singleCommands')) {
            editorCommands.singleCommands = BeanUtils.getValue(config, 'components.pdoc-editor-commands.singleCommands');
        }
        if (BeanUtils.getValue(config, 'components.pdoc-editor-commands.rangeCommands')) {
            editorCommands.rangeCommands = BeanUtils.getValue(config, 'components.pdoc-editor-commands.rangeCommands');
        }
        if (BeanUtils.getValue(config, 'components.pdoc-editor-commands.commandBlocks')) {
            editorCommands.commandBlocks = BeanUtils.getValue(config, 'components.pdoc-editor-commands.commandBlocks');
        }
        if (BeanUtils.getValue(config, 'components.pdoc-editor-commands.sampleDesc')) {
            sampleDesc = BeanUtils.getValue(config, 'components.pdoc-editor-commands.sampleDesc');
        }

        const defaultConfig: MarkdownPadEditorPageComponentConfig = {
            editorCommands: editorCommands,
            sampleDesc: sampleDesc
        };

        return defaultConfig;
    }

    protected configureComponent(config: {}): void {
        const componentConfig = this.getComponentConfig(config);
        this.editorCommands = componentConfig.editorCommands;
        this.sampleDesc = componentConfig.sampleDesc;
    }

    protected configureProcessing(config: {}): void {
        this.commonRoutingService.setRoutingState(RoutingState.DONE);
        this.showLoadingSpinner = false;
        this.initialized = true;
        this.cd.markForCheck();

        const me = this;
        setTimeout(function() { me.pageUtils.scrollToTopOfElement(me.editorTop); }, 1000);
    }

    protected processError(data: any): boolean {
        return false;
    }

    protected setMetaTags(config: {}, pdoc: PDocRecord, record: any): void {
    }

    protected setPageLayoutAndStyles(): void {
    }

}
