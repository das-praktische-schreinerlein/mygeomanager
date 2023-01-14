import {SiteMapGeneratorCommand} from './sitemap-generator.command';
import {
    CommonAdminCommandConfigType,
    CommonAdminCommandManager
} from '@dps/mycms-server-commons/dist/backend-commons/commands/common-admin-command.manager';
import {ExtendedConfigInitializerCommand} from './extendedconfig-initializer.command';
import {GeoDocConverterCommand} from './gdoc-converter.command';
import {GeoDocLoaderCommand} from './gdoc-loader.command';
import {GeoDocExporterCommand} from './gdoc-exporter.command';
import {MediaManagerCommand} from './media-manager.command';

export interface AdminCommandConfigType extends CommonAdminCommandConfigType {
}

export class AdminCommandManager extends CommonAdminCommandManager<AdminCommandConfigType> {
    constructor(adminCommandConfig: AdminCommandConfigType) {
        super({
            'initConfig': new ExtendedConfigInitializerCommand(),
            'convertGeoDoc': new GeoDocConverterCommand(),
            'loadGeoDoc': new GeoDocLoaderCommand(),
            'exportGeoDoc': new GeoDocExporterCommand(),
            'mediaManager': new MediaManagerCommand(),
            'generateSitemap': new SiteMapGeneratorCommand()
        }, adminCommandConfig);
    }

}

