import {CacheConfig} from '@dps/mycms-server-commons/dist/server-commons/datacache.module';
import {CommonBackendConfigType} from '@dps/mycms-server-commons/dist/backend-commons/modules/backend.commons';
import {CommonKeywordMapperConfigType} from '@dps/mycms-server-commons/dist/backend-commons/modules/backend.commons';

export interface BackendConfigType extends CommonBackendConfigType<CommonKeywordMapperConfigType, CacheConfig> {
}
