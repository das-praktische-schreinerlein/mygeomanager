import {SiteMapGeneratorCommand} from './sitemap-generator.command';
import {
    CommonAdminCommandConfigType,
    CommonAdminCommandManager
} from '@dps/mycms-server-commons/dist/backend-commons/commands/common-admin-command.manager';
import {GeoDocConverterCommand} from './gdoc-converter.command';
import {GeoDocLoaderCommand} from './gdoc-loader.command';
import {GeoDocExporterCommand} from './gdoc-exporter.command';

export interface AdminCommandConfigType extends CommonAdminCommandConfigType {
}

export class AdminCommandManager extends CommonAdminCommandManager<AdminCommandConfigType> {
    constructor(adminCommandConfig: AdminCommandConfigType) {
        super({
            'convertGeoDoc': new GeoDocConverterCommand(),
            'loadGeoDoc': new GeoDocLoaderCommand(),
            'exportGeoDoc': new GeoDocExporterCommand(),
            'generateSitemap': new SiteMapGeneratorCommand()
        }, adminCommandConfig);
    }

}

