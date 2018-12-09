import * as fs from 'fs';
import {utils} from 'js-data';
import {GeoDocAdapterResponseMapper} from '../shared/gdoc-commons/services/gdoc-adapter-response.mapper';
import {AbstractCommand} from '@dps/mycms-server-commons/dist/backend-commons/commands/abstract.command';
import {GeoDocDataServiceModule} from "../modules/gdoc-dataservice.module";
import {GeoDocConverterModule} from "../modules/gdoc-converter.module";
import {GeoDocSolrAdapter} from "../shared/gdoc-commons/services/gdoc-solr.adapter";

export class GeoDocConverterCommand implements AbstractCommand {
    public process(argv): Promise<any> {
        const filePathConfigJson = argv['c'] || argv['backend'] || 'config/backend.json';
        const backendConfig = JSON.parse(fs.readFileSync(filePathConfigJson, {encoding: 'utf8'}));
        const writable = backendConfig['gdocWritable'] === true || backendConfig['gdocWritable'] === 'true';
        const dataService = GeoDocDataServiceModule.getDataService('gdocSolrReadOnly', backendConfig);
        const action = argv['action'];
        const srcFile = argv['srcFile'];
        const mode = argv['mode'];
        if (writable) {
            dataService.setWritable(true);
        }

        const gdocConverterModule = new GeoDocConverterModule(backendConfig, dataService);
        
        let promise: Promise<any>;
        switch (action) {
            case 'convertGeoJsonToGeoDoc':
                if (srcFile === undefined) {
                    console.error(srcFile + ' missing parameter - usage: --srcFile SRCFILE', argv);
                    promise = utils.reject(mode + ' missing parameter - usage: --srcFile SRCFILE');
                    return promise;
                }
                if (mode === undefined || (mode !== 'SOLR' && mode !== 'RESPONSE')) {
                    console.error(mode + ' missing parameter - usage: --mode SOLR|RESPONSE', argv);
                    promise = utils.reject(mode + ' missing parameter - usage: --mode SOLR|RESPONSE');
                    return promise;
                }

                promise = gdocConverterModule.convertGeoJSONOGeoDoc(srcFile);
                promise.then(value => {
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
                    console.log(JSON.stringify({ gdocs: gdocs}, undefined, ' '));
                }).catch(reason => {
                    console.error('something went wrong:', reason);
                });

                break;
            default:
                console.error('unknown action:', argv);
                promise = utils.reject('unknown action');
        }

        return promise;
    }
}
