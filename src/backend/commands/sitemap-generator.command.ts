import * as fs from 'fs';
import {SitemapConfig, SitemapGeneratorModule} from '@dps/mycms-server-commons/dist/backend-commons/modules/sitemap-generator.module';
import {PDocSearchForm} from '@dps/mycms-commons/dist/pdoc-commons/model/forms/pdoc-searchform';
import {PDocRecord} from '@dps/mycms-commons/dist/pdoc-commons/model/records/pdoc-record';
import {PDocDataServiceModule} from '../modules/pdoc-dataservice.module';
import {AbstractCommand} from '@dps/mycms-server-commons/dist/backend-commons/commands/abstract.command';

export class SiteMapGeneratorCommand implements AbstractCommand {
    public process(argv): Promise<any> {
        const filePathConfigJson = argv['c'] || argv['backend'];
        const filePathSitemapConfigJson = argv['s'] || argv['sitemap'] || argv['_'][0];
        if (filePathConfigJson === undefined || filePathSitemapConfigJson === undefined) {
            console.error('ERROR - parameters required backendConfig: "-c | --backend" sitemapConfig: "-s | --sitemap"');
            process.exit(-1);
        }

        const generatorConfig = {
            backendConfig: JSON.parse(fs.readFileSync(filePathConfigJson, {encoding: 'utf8'})),
            sitemapConfig: JSON.parse(fs.readFileSync(filePathSitemapConfigJson, {encoding: 'utf8'}))
        };

        // generate SiteMap
        const sitemapConfig = Object.assign({}, generatorConfig.sitemapConfig, {
            fileBase: 'sitemap-pdoc-',
            showBaseUrl: generatorConfig.sitemapConfig.showBaseUrl + 'sections/',
            urlGenerator: function (config: SitemapConfig, doc: PDocRecord): string[] {
                return [config.showBaseUrl + doc.id,
                    //    config.showBaseUrl + doc.id + '/search/jederzeit/ueberall/alles/egal/ungefiltert/ratePers/route,location/10/1'
                ];
            }
        });
        return SitemapGeneratorModule.generateSiteMapFiles(
            PDocDataServiceModule.getDataService('pdocSolr' + sitemapConfig.locale + 'ReadOnly', generatorConfig.backendConfig,
                sitemapConfig.locale),
            sitemapConfig,
            new PDocSearchForm({})
        );
    }
}
