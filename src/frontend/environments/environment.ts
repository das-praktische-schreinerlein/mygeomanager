// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

import {AppEnvironment} from './app-environment';
import {DataMode} from '../shared/commons/model/datamode.enum';

export const environment: AppEnvironment = {
    hideCopyrightFooter: true,
    production: false,
    assetsPathVersionSnippet: '',
    assetsPathVersionSuffix: '',
    pdocWritable: true,
    pdocActionTagWritable: true,
    pdocEmptyDefaultSearchTypes: 'page',
    defaultSearchTypes: '',
    emptyDefaultSearchTypes: '',
    useAssetStoreUrls: false,
    allowAutoPlay: false,
    gdocMaxItemsPerAlbum: 2000,
    backendApiBaseUrl: 'http://localhost:4100/api/v1/',
    cookieLawSeenName: 'cookieLawSeenV20180525',
    trackingProviders: [], // Angulartics2Piwik
    adminBackendApiBaseUrl: 'http://localhost:4900/adminapi/v1/',
    adminWritable: true,
    hideInternalDescLinks: false,
    hideInternalImages: false,
    startDataMode: DataMode.BACKEND,
    availableDataModes: [DataMode.BACKEND, DataMode.STATIC]
};
