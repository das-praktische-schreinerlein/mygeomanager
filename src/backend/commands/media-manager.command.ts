import * as fs from 'fs';
import {GeoDocFileUtils} from '../shared/gdoc-commons/services/gdoc-file.utils';
import {
    CommonAdminCommand,
    SimpleConfigFilePathValidationRule,
    SimpleFilePathValidationRule
} from '@dps/mycms-server-commons/dist/backend-commons/commands/common-admin.command';
import {
    KeywordValidationRule,
    NumberValidationRule,
    RegExValidationReplaceRule,
    ValidationRule,
    WhiteListValidationRule
} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {FileUtils} from '@dps/mycms-commons/dist/commons/utils/file.utils';
import {BackendConfigType} from '../modules/backend.commons';
import {ViewerManagerModule} from '@dps/mycms-server-commons/dist/media-commons/modules/viewer-manager.module';
import * as XRegExp from 'xregexp';

export class SimpleFilePathListValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean) {
        super(required,
            new XRegExp('^[-,_.a-zA-Z0-9\:\/\\\\ \\p{LC}]*$', 'gi'),
            new XRegExp('[-,_.a-zA-Z0-9\:\/\\\\ \\p{LC}]*', 'gi'), '', 4096);
    }
}

export class MediaManagerCommand extends CommonAdminCommand {
    protected createValidationRules(): {[key: string]: ValidationRule} {
        return {
            action: new KeywordValidationRule(true),
            backend: new SimpleConfigFilePathValidationRule(true),
            srcFile: new SimpleFilePathValidationRule(false),
            srcFiles: new SimpleFilePathListValidationRule(false),
            exportDir: new SimpleFilePathValidationRule(false),
            exportName: new SimpleFilePathValidationRule(false),
            ignoreErrors: new NumberValidationRule(false, 1, 999999999, 10),
            parallel: new NumberValidationRule(false, 1, 999, 10),
            force: new KeywordValidationRule(false),
            skipCheckForExistingFilesInDataBase : new KeywordValidationRule(false),
            renameFileIfExists:  new WhiteListValidationRule(false, [true, false, 'true', 'false'], false)
        };
    }

    protected definePossibleActions(): string[] {
        return [
            'generateHtmlViewerFileForExport', 'inlineDataOnViewerFile'
            ];
    }

    protected processCommandArgs(argv: {}): Promise<any> {
        // importDir and outputDir are used in CommonMediaManagerCommand too
        argv['srcFile'] = GeoDocFileUtils.normalizeCygwinPath(argv['srcFile']);

        const filePathConfigJson = argv['backend'];
        if (filePathConfigJson === undefined) {
            return Promise.reject('ERROR - parameters required backendConfig: "--backend"');
        }

        const action = argv['action'];
        const backendConfig: BackendConfigType = JSON.parse(fs.readFileSync(filePathConfigJson, {encoding: 'utf8'}));

        let promise: Promise<any>;

        const srcFile = argv['srcFile'];
        const srcFiles: string[] = argv['srcFiles']
            ? argv['srcFiles'].split(',')
            : [];
        const exportDir = argv['exportDir'];
        const exportName = argv['exportName'];

        const viewerManagerModule = new ViewerManagerModule();

        switch (action) {
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

                promise = viewerManagerModule.inlineDataOnViewerFile(
                    backendConfig.nodejsBinaryPath,
                    backendConfig.inlineJsPath,
                    srcFile,
                    srcFile);

                break;
        }

        return promise;
    }
}
