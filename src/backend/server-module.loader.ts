import {ConfigureServerModule} from '@dps/mycms-server-commons/dist/server-commons/configure-server.module';
import {FirewallConfig} from '@dps/mycms-server-commons/dist/server-commons/firewall.commons';
import {DnsBLModule} from '@dps/mycms-server-commons/dist/server-commons/dnsbl.module';
import {FirewallModule} from '@dps/mycms-server-commons/dist/server-commons/firewall.module';
import {PDocDataService} from '@dps/mycms-commons/dist/pdoc-commons/services/pdoc-data.service';
import {DataCacheModule} from '@dps/mycms-server-commons/dist/server-commons/datacache.module';
import {CommonServerConfigType} from '@dps/mycms-server-commons/dist/server-commons/server.commons';
import {BackendConfigType} from './modules/backend.commons';
import {GeoDocDataServiceModule} from './modules/gdoc-dataservice.module';
import {GeoDocDataService} from 'shared/gdoc-commons/services/gdoc-data.service';
import {GeoDocServerModule} from './modules/gdoc-server.module';
import {
    PDocWriterServerModule
} from '@dps/mycms-server-commons/dist/pdoc-backend-commons/modules/pdoc-writer-server.module';
import {PagesServerModule} from '@dps/mycms-server-commons/dist/pdoc-backend-commons/modules/pages-server.module';
import {
    PagesDataserviceModule
} from '@dps/mycms-server-commons/dist/pdoc-backend-commons/modules/pages-dataservice.module';
import {StaticPagesDataService} from '@dps/mycms-commons/dist/pdoc-commons/services/staticpages-data.service';
import {
    PDocDataServiceModule
} from '@dps/mycms-server-commons/dist/pdoc-backend-commons/modules/pdoc-dataservice.module';
import {PDocServerModule} from '@dps/mycms-server-commons/dist/pdoc-backend-commons/modules/pdoc-server.module';
import {MarkdownService} from '@dps/mycms-commons/dist/markdown-commons/markdown.service';
import {DefaultOptions} from '@dps/mycms-commons/dist/markdown-commons/options';
import {MarkdownDefaultExtensions} from '@dps/mycms-commons/dist/markdown-commons/extensions/markdown.extensions';

export interface ServerConfig extends CommonServerConfigType<BackendConfigType, FirewallConfig> {
}

export class ServerModuleLoader {
    public static loadModules(app, serverConfig: ServerConfig) {
        const cache: DataCacheModule = new DataCacheModule(serverConfig.backendConfig.cacheConfig);

        ServerModuleLoader.configureDefaultServer(app, serverConfig, cache);
        ServerModuleLoader.loadModulePages(app, serverConfig, cache);
        ServerModuleLoader.loadAdditionalModules(app, serverConfig, cache);
    }

    public static configureDefaultServer(app, serverConfig: ServerConfig, cache: DataCacheModule) {
        ConfigureServerModule.configureServer(app, serverConfig.backendConfig);

        if (!ServerModuleLoader.isServerWritable(serverConfig)) {
            ConfigureServerModule.configureServerAddHysteric(app, serverConfig.backendConfig);
        }

        FirewallModule.configureFirewall(app, serverConfig.firewallConfig, serverConfig.filePathErrorDocs);
        DnsBLModule.configureDnsBL(app, serverConfig.firewallConfig, serverConfig.filePathErrorDocs);

        // configure dataservices
        const gdocDataService: GeoDocDataService = GeoDocDataServiceModule.getDataService('gdocSolr',
            serverConfig.backendConfig);
        const pdocDataServiceDE: PDocDataService = PDocDataServiceModule.getDataService('pdocSolrDE',
            serverConfig.backendConfig);
        const pdocDataServiceEN: PDocDataService = PDocDataServiceModule.getDataService('pdocSolrEN',
            serverConfig.backendConfig);

        // add routes
        const gdocServerModule = GeoDocServerModule.configureRoutes(app, serverConfig.apiDataPrefix, gdocDataService, cache,
            serverConfig.backendConfig);
        PDocServerModule.configureRoutes(app, serverConfig.apiDataPrefix, pdocDataServiceDE, cache, serverConfig.backendConfig);
        PDocServerModule.configureRoutes(app, serverConfig.apiDataPrefix, pdocDataServiceEN, cache, serverConfig.backendConfig);

        ConfigureServerModule.configureDefaultErrorHandler(app);
    }

    public static loadModulePages(app, serverConfig: ServerConfig, cache: DataCacheModule) {
        const markdownService = new MarkdownService(DefaultOptions.getDefault(), MarkdownDefaultExtensions);
        const pagesDataServiceDE: StaticPagesDataService = PagesDataserviceModule.getDataService('pdocSolrDE',
            serverConfig.backendConfig, 'de', markdownService);
        const pagesDataServiceEN: StaticPagesDataService = PagesDataserviceModule.getDataService('pdocSolrEN',
            serverConfig.backendConfig, 'en', markdownService);

        PagesServerModule.configureRoutes(app, serverConfig.apiDataPrefix, pagesDataServiceDE, 'de', serverConfig.backendConfig.profile);
        PagesServerModule.configureRoutes(app, serverConfig.apiDataPrefix, pagesDataServiceEN, 'en', serverConfig.backendConfig.profile);
    }

    public static loadModulePDoc(app, serverConfig: ServerConfig, cache: DataCacheModule) {
        if (serverConfig.backendConfig.startPDocApi) {
            const pdocDataService: PDocDataService = PDocDataServiceModule.getDataService('pdocSolr',
                serverConfig.backendConfig);
            const pdocServerModule = PDocServerModule.configureRoutes(app, serverConfig.apiDataPrefix,
                pdocDataService, cache, serverConfig.backendConfig);

            const pdocWritable = serverConfig.backendConfig.pdocWritable === true
                || <any>serverConfig.backendConfig.pdocWritable === 'true';
            if (pdocWritable) {
                PDocWriterServerModule.configureRoutes(app, serverConfig.apiDataPrefix, pdocServerModule);
            }
        }
    }

    public static isServerWritable(serverConfig: ServerConfig) {
        const pdocWritable = serverConfig.backendConfig.pdocWritable === true
            || <any>serverConfig.backendConfig.pdocWritable === 'true';

        return pdocWritable;
    }

    public static loadAdditionalModules(app, serverConfig: ServerConfig, cache: DataCacheModule) {
        ServerModuleLoader.loadModulePDoc(app, serverConfig, cache);
    }

}
