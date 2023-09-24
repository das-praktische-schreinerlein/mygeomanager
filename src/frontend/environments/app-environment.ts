import {DataMode} from '../shared/commons/model/datamode.enum';
import {CommonEnvironment} from '@dps/mycms-frontend-commons/dist/frontend-section-commons/common-environment';

export interface AppEnvironment extends CommonEnvironment {
    pdocWritable?: boolean;
    pdocActionTagWritable?: boolean;
    pdocEmptyDefaultSearchTypes?: string,
    hideCopyrightFooter?: boolean,
    hideInternalDescLinks?: boolean;
    hideInternalImages?: boolean,
    assetsPathVersionSnippet: string;
    assetsPathVersionSuffix: string;
    gdocMaxItemsPerAlbum: number;
    currentDataMode?: DataMode;
    startDataMode?: DataMode;
    availableDataModes?: DataMode[];
    staticPDocsFile?: string;
    staticGDocsFiles?: string[];
}
