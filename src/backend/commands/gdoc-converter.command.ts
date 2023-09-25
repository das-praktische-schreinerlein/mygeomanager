import * as fs from 'fs';
import {GeoDocAdapterResponseMapper} from '../shared/gdoc-commons/services/gdoc-adapter-response.mapper';
import {GeoDocDataServiceModule} from '../modules/gdoc-dataservice.module';
import {GeoDocConverterModule} from '../modules/gdoc-converter.module';
import {GeoDocSolrAdapter} from '../shared/gdoc-commons/services/gdoc-solr.adapter';
import {CommonAdminCommand} from '@dps/mycms-server-commons/dist/backend-commons/commands/common-admin.command';
import {DateUtils} from '@dps/mycms-commons/dist/commons/utils/date.utils';
import {FileUtils} from '@dps/mycms-commons/dist/commons/utils/file.utils';
import {GeoDocFileUtils} from '../shared/gdoc-commons/services/gdoc-file.utils';
import {
    SimpleConfigFilePathValidationRule,
    SimpleFilePathValidationRule,
    ValidationRule,
    WhiteListValidationRule
} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';

export class GeoDocConverterCommand extends CommonAdminCommand {
    protected createValidationRules(): {[key: string]: ValidationRule} {
        return {
            backend: new SimpleConfigFilePathValidationRule(true),
            srcFile: new SimpleFilePathValidationRule(true),
            file: new SimpleFilePathValidationRule(true),
            renameFileIfExists: new WhiteListValidationRule(false, [true, false, 'true', 'false'], false),
            mode: new WhiteListValidationRule(true, ['SOLR', 'RESPONSE'], false)
        };
    }

    protected definePossibleActions(): string[] {
        return ['convertGeoJsonToGeoDoc'];
    }

    protected processCommandArgs(argv: {}): Promise<any> {
        const filePathConfigJson = argv['backend'];
        if (filePathConfigJson === undefined) {
            return Promise.reject('ERROR - parameters required backendConfig: "--backend"');
        }

        const backendConfig = JSON.parse(fs.readFileSync(filePathConfigJson, {encoding: 'utf8'}));
        const writable = backendConfig['gdocWritable'] === true || backendConfig['gdocWritable'] === 'true';
        const dataService = GeoDocDataServiceModule.getDataService('gdocSolrReadOnly', backendConfig);
        const action = argv['action'];
        if (writable) {
            dataService.setWritable(true);
        }

        const gdocConverterModule = new GeoDocConverterModule(backendConfig, dataService);

        let promise: Promise<any>;
        switch (action) {
            case 'convertGeoJsonToGeoDoc':
                const dataFileName = GeoDocFileUtils.normalizeCygwinPath(argv['file']);
                if (dataFileName === undefined) {
                    return Promise.reject('option --file expected');
                }

                const srcFile = GeoDocFileUtils.normalizeCygwinPath(argv['srcFile']);
                if (srcFile === undefined) {
                    console.error(srcFile + ' missing parameter - usage: --srcFile SRCFILE', argv);
                    return Promise.reject(srcFile + ' missing parameter - usage: --srcFile SRCFILE');
                }

                const mode = argv['mode'];
                if (mode === undefined || (mode !== 'SOLR' && mode !== 'RESPONSE')) {
                    console.error(mode + ' missing parameter - usage: --mode SOLR|RESPONSE', argv);
                    return Promise.reject(mode + ' missing parameter - usage: --mode SOLR|RESPONSE');
                }

                const renameFileIfExists = !!argv['renameFileIfExists'];
                let fileCheckPromise: Promise<any>;
                if (fs.existsSync(dataFileName)) {
                    if (!renameFileIfExists) {
                        return Promise.reject('exportfile already exists');
                    }

                    const newFile = dataFileName + '.' + DateUtils.formatToFileNameDate(new Date(), '', '-', '') + '-export.MOVED';
                    fileCheckPromise = FileUtils.moveFile(dataFileName, newFile, false);
                } else {
                    fileCheckPromise = Promise.resolve();
                }

                promise = fileCheckPromise.then(() => {
                    return gdocConverterModule.convertGeoJSONOGeoDoc(srcFile).then(value => {
                        const responseMapper = new GeoDocAdapterResponseMapper(backendConfig);
                        const solrAdapter = new GeoDocSolrAdapter({});
                        const gdocs = [];
                        for (const gdoc of value) {
                            if (mode === 'SOLR') {
                                gdocs.push(solrAdapter.mapToAdapterDocument(gdoc));
                            } else {
                                gdocs.push(responseMapper.mapToAdapterDocument({}, gdoc));
                            }
                        }

                        fs.writeFileSync(dataFileName, JSON.stringify({ gdocs: gdocs}, undefined, ' '));
                    }).catch(reason => {
                        console.error('something went wrong:', reason);
                        return Promise.reject(reason);
                    });
                }).catch(reason => {
                    return Promise.reject('exportfile already exists and cant be renamed: ' + reason);
                })

                break;
            default:
                console.error('unknown action:', argv);
                return Promise.reject('unknown action');
        }

        return promise;
    }
}
