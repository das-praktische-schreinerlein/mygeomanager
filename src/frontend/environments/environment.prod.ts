import {AppEnvironment} from './app-environment';
import {DataMode} from '../shared/commons/model/datamode.enum';
import {PrintDialogPdfGenerator} from '@dps/mycms-frontend-commons/dist/angular-commons/services/print-dialog-pdf.generator';

export const environment: AppEnvironment = {
    production: true,
    assetsPathVersionSnippet: '',
    assetsPathVersionSuffix: '',
    pdocWritable: false,
    pdocActionTagWritable: false,
    pdocEmptyDefaultSearchTypes: 'page',
    defaultSearchTypes: '',
    emptyDefaultSearchTypes: '',
    useAssetStoreUrls: false,
    allowAutoPlay: false,
    gdocMaxItemsPerAlbum: 2000,
    backendApiBaseUrl: 'http://localhost:4102/api/v1/',
    cookieLawSeenName: 'cookieLawSeenV20180525',
    trackingProviders: [], // Angulartics2Piwik
    hideInternalDescLinks: false,
    hideInternalImages: false,
    startDataMode: DataMode.BACKEND,
    availableDataModes: [DataMode.BACKEND]
};

// unset logger
console.trace = function() {};
console.debug = function() {};
console.log = function() {};
console.warn = function() {};
console.error = function() {};

// TODO if you want pdf replace PrintDialogPdfGenerator by JsPdfGenerator and move jspdf in package.json from optional to dep
export class EnvironmentPdfGenerator extends PrintDialogPdfGenerator {}

