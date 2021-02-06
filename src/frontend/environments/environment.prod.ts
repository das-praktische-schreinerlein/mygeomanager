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
    backendApiBaseUrl: 'http://localhost:4102/api/v1/',
    cookieLawSeenName: 'cookieLawSeenV20180525',
    trackingProviders: [] // Angulartics2Piwik
};

// unset logger
console.trace = function() {};
console.debug = function() {};
console.log = function() {};
console.warn = function() {};
console.error = function() {};

