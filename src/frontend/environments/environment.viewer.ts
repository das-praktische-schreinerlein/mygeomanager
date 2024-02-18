import {AppEnvironment} from './app-environment';
import {DataMode} from '../shared/commons/model/datamode.enum';
import {PrintDialogPdfGenerator} from '@dps/mycms-frontend-commons/dist/angular-commons/services/print-dialog-pdf.generator';

export const environment: AppEnvironment = {
    hideCopyrightFooter: true,
    production: false, // TODO set this to false for development
    assetsPathVersionSnippet: '',
    assetsPathVersionSuffix: '',
    defaultSearchTypes: '',
    emptyDefaultSearchTypes: '',
    useAssetStoreUrls: false,
    pdocWritable: false,
    pdocActionTagWritable: false,
    pdocEmptyDefaultSearchTypes: 'page',
    allowAutoPlay: false,
    gdocMaxItemsPerAlbum: 2000,
    backendApiBaseUrl: undefined,
    cookieLawSeenName: 'cookieLawSeenV20180525',
    trackingProviders: [], // Angulartics2Piwik
    staticPDocsFile: 'assets/staticdata/static.mygeompdocs.js',
    staticGDocsFiles: ['assets/staticdata/static.mygeomgdocs.js'],
    adminWritable: false,
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

// TODO if you want pdf replace PrintDialogPdfGenerator by JsPdfGenerator and move jspdf in package.json from optional to dep
export class EnvironmentPdfGenerator extends PrintDialogPdfGenerator {}
