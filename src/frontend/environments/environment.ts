// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

import {Angulartics2Piwik} from 'angulartics2/piwik';
import {AppEnvironment} from './app-environment';

export const environment: AppEnvironment = {
    production: false,
    assetsPathVersionSnippet: '',
    assetsPathVersionSuffix: '',
    defaultSearchTypes: '',
    emptyDefaultSearchTypes: '',
    useAssetStoreUrls: false,
    allowAutoPlay: false,
    gdocMaxItemsPerAlbum: 2000,
    backendApiBaseUrl: 'http://localhost:4100/api/v1/',
    cookieLawSeenName: 'cookieLawSeenV20180525',
    trackingProviders: [Angulartics2Piwik],
    adminBackendApiBaseUrl: 'http://localhost:4900/adminapi/v1/',
    adminWritable: true
};
