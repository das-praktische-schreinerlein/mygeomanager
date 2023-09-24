import * as fs from 'fs';
import {GeoDocFileUtils} from '../shared/gdoc-commons/services/gdoc-file.utils';
import {
    CommonAdminCommand,
    SimpleConfigFilePathValidationRule,
    SimpleFilePathValidationRule
} from '@dps/mycms-server-commons/dist/backend-commons/commands/common-admin.command';
import {CommonAdminCommand} from '@dps/mycms-server-commons/dist/backend-commons/commands/common-admin.command';
import {
    KeywordValidationRule,
    NumberValidationRule,
    SimpleConfigFilePathValidationRule,
    SimpleFilePathValidationRule,
    ValidationRule,
    WhiteListValidationRule
} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {FileUtils} from '@dps/mycms-commons/dist/commons/utils/file.utils';
import {BackendConfigType} from '../modules/backend.commons';
import {ViewerManagerModule} from '@dps/mycms-server-commons/dist/media-commons/modules/viewer-manager.module';
import {PDocFileUtils} from '@dps/mycms-commons/dist/pdoc-commons/services/pdoc-file.utils';
import path from 'path';

export class MediaManagerCommand extends CommonAdminCommand {
    protected createValidationRules(): {[key: string]: ValidationRule} {
        return {
            action: new KeywordValidationRule(true),
            backend: new SimpleConfigFilePathValidationRule(true),
            srcFile: new SimpleFilePathValidationRule(false),
            srcFiles: new SimpleFilePathListValidationRule(false),
            pdocFile: new SimpleFilePathValidationRule(false),
            exportDir: new SimpleFilePathValidationRule(false),
            exportName: new SimpleFilePathValidationRule(false),
            ignoreErrors: new NumberValidationRule(false, 1, 999999999, 10),
            inlineProfile: new KeywordValidationRule(false),
            outputFile: new SimpleFilePathValidationRule(false),
            parallel: new NumberValidationRule(false, 1, 999, 10),
            force: new KeywordValidationRule(false),
            skipCheckForExistingFilesInDataBase : new KeywordValidationRule(false),
            renameFileIfExists:  new WhiteListValidationRule(false, [true, false, 'true', 'false'], false)
        };
    }

    protected definePossibleActions(): string[] {
        return [
            'setPDocsInViewerFile', 'generateHtmlViewerFileForExport', 'inlineDataOnViewerFile'
            ];
    }

    protected processCommandArgs(argv: {}): Promise<any> {
        const me = this;

        // importDir and outputDir are used in CommonMediaManagerCommand too
        argv['srcFile'] = PDocFileUtils.normalizeCygwinPath(argv['srcFile']);
        argv['pdocFile'] = PDocFileUtils.normalizeCygwinPath(argv['pdocFile']);
        argv['outputFile'] = PDocFileUtils.normalizeCygwinPath(argv['outputFile']);

        const filePathConfigJson = argv['backend'];
        if (filePathConfigJson === undefined) {
            return Promise.reject('ERROR - parameters required backendConfig: "--backend"');
        }

        const action = argv['action'];
        const outputFile = argv['outputFile'];
        const backendConfig: BackendConfigType = JSON.parse(fs.readFileSync(filePathConfigJson, {encoding: 'utf8'}));

        let promise: Promise<any>;

        const srcFile = argv['srcFile'];
        const pdocFile = argv['pdocFile'];
        const srcFiles: string[] = argv['srcFiles']
            ? argv['srcFiles'].split(',')
            : [];
        const exportDir = argv['exportDir'];
        const exportName = argv['exportName'];
        const inlineProfile = argv['inlineProfile'];

        const viewerManagerModule = new ViewerManagerModule();

        switch (action) {
            case 'setPDocsInViewerFile':
                if (srcFile === undefined) {
                    console.error(action + ' missing parameter - usage: --srcFile SRCFILE', argv);
                    promise = Promise.reject(action + ' missing parameter - usage: --srcFile SRCFILE');
                    return promise;
                }

                if (pdocFile === undefined) {
                    console.error(action + ' missing parameter - usage: --pdocFile PDOCFILE', argv);
                    promise = Promise.reject(action + ' missing parameter - usage: --pdocFile PDOCFILE');
                    return promise;
                }

                promise = viewerManagerModule.generateViewerHtmlFile(srcFile, [pdocFile],
                    srcFile, 999999999, 'pdocs',
                    function (html: string) {
                        return html;
                    },
                    function (html: string, jsonPFileName: string) {
                        return viewerManagerModule.jsonToJsTargetContentConverter(html, jsonPFileName,
                            'importStaticDataPDocsJsonP');
                    },
                    function (html: string, jsonPFilePath: string) {
                        return me.htmlPDocInlineFileConverter(html, jsonPFilePath,
                            'staticPDocsFile');
                    }
                );
                break;
            case 'generateHtmlViewerFileForExport':
                if (exportDir === undefined) {
                    console.error(action + ' missing parameter - usage: --exportDir EXPORTDIR', argv);
                    promise = Promise.reject(action + ' missing parameter - usage: --exportDir EXPORTDIR [-force true/false]');
                    return promise;
                }

                if (exportName === undefined) {
                    console.error(action + ' missing parameter - usage: --exportName EXPORTNAME', argv);
                    promise = Promise.reject(action + ' missing parameter - usage: --exportName EXPORTNAME');
                    return promise;
                }

                if (srcFiles.length < 1) {
                    console.error(action + ' missing parameter - usage: --srcFiles JSONFILE,JSONFILE2...', argv);
                    promise = Promise.reject(action + ' missing parameter - usage: --srcFiles JSONFILE,JSONFILE2...');
                    return promise;
                }

                promise = FileUtils.mergeJsonFiles(srcFiles, exportDir + '/' + exportName + '-merged.gdocexport.json', 'id', 'gdocs')
                    .then((resultFile) => {
                        return viewerManagerModule.generateViewerHtmlFile(srcFile, [resultFile],
                            exportDir + '/' + exportName + '.html', 100, 'gdocs',
                            function (html: string) {
                                return viewerManagerModule.htmlConfigConverter(html, 'staticGDocsFiles');
                            },
                            function (html: string, jsonPFileName: string) {
                                return viewerManagerModule.jsonToJsTargetContentConverter(html, jsonPFileName,
                                    'importStaticDataGDocsJsonP');
                            },
                            function (html: string, dataFileConfigName: string) {
                                return viewerManagerModule.htmlInlineFileConverter(html, dataFileConfigName,
                                    'staticGDocsFiles');
                            }
                        );
                });

                break;
            case 'inlineDataOnViewerFile':
                if (!backendConfig.nodejsBinaryPath || !backendConfig.inlineJsPath) {
                    console.error(action + ' missing config - nodejsBinaryPath, inlineJsPath');
                    promise = Promise.reject(action + ' missing config - nodejsBinaryPath, inlineJsPath');
                    return promise;
                }

                if (srcFile === undefined) {
                    console.error(action + ' missing parameter - usage: --srcFile SRCFILE', argv);
                    promise = Promise.reject(action + ' missing parameter - usage: --srcFile SRCFILE');
                    return promise;
                }

                const targetFileName = outputFile !== undefined
                    ? outputFile
                    : srcFile

                // TODO password for encryption

                promise = viewerManagerModule.inlineDataOnViewerFile(
                    backendConfig.nodejsBinaryPath,
                    backendConfig.inlineJsPath,
                    srcFile,
                    targetFileName,
                    inlineProfile);

                break;
        }

        return promise;
    }

    public htmlPDocInlineFileConverter(html: string, jsonPFilePath: string, dataFileConfigName: string): string {
        const fileName = path.basename(jsonPFilePath);
        html = html.replace(/<\/head>/g,
            '\n  <script inlineexport type="text/javascript" src="' + fileName + '"></script>\n</head>');
        const regExp = new RegExp(dataFileConfigName + '": ".*?"', 'g');
        html = html.replace(regExp,
            dataFileConfigName + '": "' + fileName + '"');

        return html;
    }
}
