import {AppEnvironment} from './app-environment';
import {DataMode} from '../shared/commons/model/datamode.enum';

export const environment: AppEnvironment = {
    hideCopyrightFooter: true,
    production: false, // TODO set this to false for development
    assetsPathVersionSnippet: '',
    assetsPathVersionSuffix: '',
    backendApiBaseUrl: undefined,
    defaultSearchTypes: '',
    emptyDefaultSearchTypes: '',
    useAssetStoreUrls: false,
    allowAutoPlay: false,
    cookieLawSeenName: 'cookieLawSeenV20180525',
    trackingProviders: [], // Angulartics2Piwik
    staticPDocsFile: 'assets/staticdata/static.myshppdocs.js',
    hideInternalDescLinks: true,
    hideInternalImages: true,
    startDataMode: DataMode.STATIC,
    availableDataModes: [DataMode.STATIC]
};

// unset logger
if (environment.production) {
    console.trace = function() {};
    console.debug = function() {};
    console.log = function() {};
    console.warn = function() {};
    console.error = function() {};
}

