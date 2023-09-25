import {SiteMapGeneratorCommand} from './sitemap-generator.command';
import {
    CommonAdminCommandConfigType,
    CommonAdminCommandManager
} from '@dps/mycms-server-commons/dist/backend-commons/commands/common-admin-command.manager';
import {GeoDocConverterCommand} from './gdoc-converter.command';
import {GeoDocLoaderCommand} from './gdoc-loader.command';
import {GeoDocExporterCommand} from './gdoc-exporter.command';
import {MediaManagerCommand} from './media-manager.command';
import {DbMigrateCommand} from '@dps/mycms-server-commons/dist/backend-commons/commands/dbmigrate.command';
import {PageManagerCommand} from '@dps/mycms-server-commons/dist/pdoc-backend-commons/commands/pdoc-manager.command';
import {PDocLoaderCommand} from '@dps/mycms-server-commons/dist/pdoc-backend-commons/commands/pdoc-loader.command';
import {
    PDocConverterCommand
} from '@dps/mycms-server-commons/dist/pdoc-backend-commons/commands/pdoc-converter.command';
import {ExtendedConfigInitializerCommand} from './extendedconfig-initializer.command';

// tslint:disable-next-line:no-empty-interface
export interface AdminCommandConfigType extends CommonAdminCommandConfigType {
}

export class AdminCommandManager extends CommonAdminCommandManager<AdminCommandConfigType> {
    constructor(adminCommandConfig: AdminCommandConfigType) {
        super({
            'convertGeoDoc': new GeoDocConverterCommand(),
            'convertPDoc': new PDocConverterCommand(),
            'dbMigrate': new DbMigrateCommand(),
            'exportGeoDoc': new GeoDocExporterCommand(),
            'generateSitemap': new SiteMapGeneratorCommand(),
            'initConfig': new ExtendedConfigInitializerCommand(),
            'loadGeoDoc': new GeoDocLoaderCommand(),
            'loadPDoc': new PDocLoaderCommand(),
            'mediaManager': new MediaManagerCommand(),
            'pageManager': new PageManagerCommand()
        }, adminCommandConfig);
    }

}

