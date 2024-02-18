import {AppEnvironment} from './app-environment';
import {environment as viewerEnvironment} from '../environments/environment.viewer';
import {
    PrintDialogPdfGenerator
} from '@dps/mycms-frontend-commons/dist/angular-commons/services/print-dialog-pdf.generator';


export const environment: AppEnvironment = viewerEnvironment;

// TODO if you want pdf replace PrintDialogPdfGenerator by JsPdfGenerator and move jspdf in package.json from optional to dep
export class EnvironmentPdfGenerator extends PrintDialogPdfGenerator {}
