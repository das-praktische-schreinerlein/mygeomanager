import {SiteMapGeneratorCommand} from './sitemap-generator.command';
import {AdminCommandConfigType} from './admin-command.manager';
import {
    CommonServerAdminCommandConfigType,
    CommonServerAdminCommandManager
} from '@dps/mycms-server-commons/dist/backend-commons/commands/common-serveradmin-command.manager';

export interface ServerAdminCommandConfigType extends CommonServerAdminCommandConfigType, AdminCommandConfigType {
    outputDir: string,
    outputFile: string,
}

export class ServerAdminCommandManager extends CommonServerAdminCommandManager<ServerAdminCommandConfigType> {

    constructor(adminCommandConfig: ServerAdminCommandConfigType) {
        // only define a subset of commands
        super({
                'generateSitemap': new SiteMapGeneratorCommand()
            },
            adminCommandConfig,
            // only allow a subset of actions
            ['generateSitemap']);
    }

    protected initializeArgs(argv: {}): Promise<{}> {
        return super.initializeArgs(argv).then(initializedArgs => {
            // set configured parameter constants
            initializedArgs['backend'] = this.adminCommandConfig.backend;

            initializedArgs['outputDir'] = this.adminCommandConfig.outputDir;
            initializedArgs['outputFile'] = this.adminCommandConfig.outputFile;

            initializedArgs['srcBaseUrl'] = this.adminCommandConfig.srcBaseUrl;
            initializedArgs['destBaseUrl'] = this.adminCommandConfig.destBaseUrl;

            // reset dangerous parameters
            initializedArgs['srcFile'] = undefined;
            initializedArgs['sitemap'] = undefined;
            initializedArgs['file'] = undefined;
            initializedArgs['mode'] = undefined;

            // TODO check and reset

            return Promise.resolve(initializedArgs);
        })
    }

}
