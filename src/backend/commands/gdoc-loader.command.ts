import * as fs from 'fs';
import {GeoDocDataServiceModule} from '../modules/gdoc-dataservice.module';
import {GeoDocFileUtils} from '../shared/gdoc-commons/services/gdoc-file.utils';
import {GeoDocAdapterResponseMapper} from '../shared/gdoc-commons/services/gdoc-adapter-response.mapper';
import {CommonDocRecord} from '@dps/mycms-commons/dist/search-commons/model/records/cdoc-entity-record';
import {CommonDocSearchForm} from '@dps/mycms-commons/dist/search-commons/model/forms/cdoc-searchform';
import {CommonDocDataService} from '@dps/mycms-commons/dist/search-commons/services/cdoc-data.service';
import {CommonDocSearchResult} from '@dps/mycms-commons/dist/search-commons/model/container/cdoc-searchresult';
import {
    GenericAdapterResponseMapper
} from '@dps/mycms-commons/dist/search-commons/services/generic-adapter-response.mapper';
import {CommonDocTransportModule} from '@dps/mycms-server-commons/dist/backend-commons/modules/cdoc-transport.module';
import {CommonAdminCommand} from '@dps/mycms-server-commons/dist/backend-commons/commands/common-admin.command';
import {
    SimpleConfigFilePathValidationRule,
    SimpleFilePathValidationRule,
    ValidationRule,
    WhiteListValidationRule
} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {DateUtils} from '@dps/mycms-commons/dist/commons/utils/date.utils';
import {FileUtils} from '@dps/mycms-commons/dist/commons/utils/file.utils';

export class GeoDocLoaderCommand extends CommonAdminCommand {
    protected createValidationRules(): {[key: string]: ValidationRule} {
        return {
            backend: new SimpleConfigFilePathValidationRule(true),
            file: new SimpleFilePathValidationRule(true),
            renameFileAfterSuccess:  new WhiteListValidationRule(false, [true, false, 'true', 'false'], false)
        };
    }

    protected definePossibleActions(): string[] {
        return ['loadGeoDocs'];
    }

    protected processCommandArgs(argv: {}): Promise<any> {
        const typeOrder = ['poi'];

        const filePathConfigJson = argv['backend'];
        if (filePathConfigJson === undefined) {
            return Promise.reject('ERROR - parameters required backendConfig: "--backend"');
        }

        const serverConfig = {
            backendConfig: JSON.parse(fs.readFileSync(filePathConfigJson, { encoding: 'utf8' })),
            readOnly: false
        };

        const dataFileName = GeoDocFileUtils.normalizeCygwinPath(argv['file']);
        if (dataFileName === undefined) {
            return Promise.reject('option --file expected');
        }

        const renameFileOption = !!argv['renameFileAfterSuccess'];
        const dataService: CommonDocDataService<CommonDocRecord, CommonDocSearchForm,
            CommonDocSearchResult<CommonDocRecord, CommonDocSearchForm>> =
            GeoDocDataServiceModule.getDataService('gdocSolr', serverConfig.backendConfig);
        dataService.setWritable(true);
        const responseMapper: GenericAdapterResponseMapper = new GeoDocAdapterResponseMapper(serverConfig.backendConfig);
        const transporter: CommonDocTransportModule = new CommonDocTransportModule();

        const recordSrcs = GeoDocFileUtils.parseRecordSourceFromJson(fs.readFileSync(dataFileName, { encoding: 'utf8' }));
        return transporter.loadDocs(recordSrcs, typeOrder, responseMapper, dataService).then(() => {
            let promise: Promise<any>;
            if (renameFileOption) {
                const newFile = dataFileName + '.' + DateUtils.formatToFileNameDate(new Date(), '', '-', '') + '-import.DONE';
                promise = FileUtils.moveFile(dataFileName, newFile, false);
            } else {
                promise = Promise.resolve();
            }

            return promise.then(() => {
                return Promise.resolve('file imported');
            }).catch(reason => {
                return Promise.resolve('file imported but cant be renamed: ' + reason);
            })
        });
    }
}
