import {CacheConfig} from '@dps/mycms-server-commons/dist/server-commons/datacache.module';
import {
    CommonBackendConfigType,
    CommonKeywordMapperConfigType,
    CommonSqlConnectionConfigType
} from '@dps/mycms-server-commons/dist/backend-commons/modules/backend.commons';
import {CommonPDocBackendConfigType} from '@dps/mycms-server-commons/dist/pdoc-backend-commons/modules/pdoc-backend.commons';
import {FacetCacheUsageConfigurations} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {FacetCacheConfiguration} from '@dps/mycms-commons/dist/facetcache-commons/model/facetcache.configuration';

export interface SqlConnectionConfigType extends CommonSqlConnectionConfigType<FacetCacheUsageConfigurations, FacetCacheConfiguration> {
}

export interface BackendConfigType extends CommonBackendConfigType<CommonKeywordMapperConfigType, CacheConfig>,
    CommonPDocBackendConfigType<SqlConnectionConfigType> {
    gdocImportConverterAdditionalKeywords?: string[],
    nodejsBinaryPath: string,
    inlineJsPath: string
}
