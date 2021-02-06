import {AppEnvironment} from './app-environment';

export const environment: AppEnvironment = {
    production: true,
    assetsPathVersionSnippet: '',
    assetsPathVersionSuffix: '',
    defaultSearchTypes: '',
    emptyDefaultSearchTypes: '',
    useAssetStoreUrls: false,
    allowAutoPlay: false,
    gdocMaxItemsPerAlbum: 2000,
    backendApiBaseUrl: 'http://localhost:4101/api/v1/',
    cookieLawSeenName: 'cookieLawSeenV20180525',
    trackingProviders: [] // Angulartics2Piwik
};
