import {
    SimpleConfigFilePathValidationRule,
    ValidationRule
} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {PasswordUtils} from '@dps/mycms-commons/dist/commons/utils/password.utils';
import {ConfigInitializerUtil} from '@dps/mycms-commons/dist/tools/config-initializer.util';
import * as Promise_serial from 'promise-serial';
import {ConfigInitializerCommand} from '@dps/mycms-server-commons/dist/backend-commons/commands/config-initializer.command';

export class ExtendedConfigInitializerCommand extends ConfigInitializerCommand {
    protected solrconfigbasepath: string;
    protected installerdbbasepath: string;

    public static replacePDocSolrPasswordInBackendConfig(file: string, solrPassword: string, required: boolean): Promise<boolean> {
        return ConfigInitializerUtil.replaceSolrPasswordInBackendConfig(file, 'solrCorePDocReadPassword', solrPassword, required);
    }

    public static replaceTourDocSolrPasswordInBackendConfig(file: string, solrPassword: string, required: boolean): Promise<boolean> {
        return ConfigInitializerUtil.replaceSolrPasswordInBackendConfig(file, 'solrCoreGeoDocReadPassword', solrPassword, required);
    }

    protected createValidationRules(): {[key: string]: ValidationRule} {
        return {
            ...super.createValidationRules(),
            'solrconfigbasepath': new SimpleConfigFilePathValidationRule(false),
            'installerdbbasepath': new SimpleConfigFilePathValidationRule(false)
        };
    }

    protected definePossibleActions(): string[] {
        return super.definePossibleActions().concat([
            'resetSolrPasswords',
            'setSolrPasswords']);
    }

    protected processCommandArgs(argv: {}): Promise<any> {
        this.configbasepath = argv['configbasepath'] || 'config';
        this.solrconfigbasepath = argv['solrconfigbasepath'] || 'installer/solr';
        this.installerdbbasepath = argv['installerdbbasepath'] || 'installer/db';
        const tokenkey = argv['tokenkey'];
        const newpassword = argv['newpassword'];

        const action = argv['action'];
        switch (action) {
            case 'resetServicePasswords':
                return this.setSolrPasswords(PasswordUtils.createNewDefaultPassword(30));
            case 'resetSolrPasswords':
                return this.setSolrPasswords(PasswordUtils.createNewDefaultPassword(30));
            case 'resetTokenCookie':
                return this.setTokenCookie(tokenkey, PasswordUtils.createNewDefaultPassword(30));
            case 'setSolrPasswords':
                return this.setSolrPasswords(newpassword);
            case 'setTokenCookie':
                return this.setTokenCookie(tokenkey, newpassword);
            default:
                return super.processCommandArgs(argv);
        }
    }

    protected setSolrPasswords(newpassword: string): Promise<any> {
        if (newpassword === undefined || newpassword.length < 8) {
            return Promise.reject('valid newpassword required');
        }

        return PasswordUtils.createSolrPasswordHash(newpassword).then(solrPasswordHash => {
            const me = this;
            const promises = [];

            promises.push(function () {
                return ExtendedConfigInitializerCommand.replaceTourDocSolrPasswordInBackendConfig(
                    me.configbasepath + '/backend.dev.json', newpassword, false);
            });
            promises.push(function () {
                return ExtendedConfigInitializerCommand.replaceTourDocSolrPasswordInBackendConfig(
                    me.configbasepath + '/backend.beta.json', newpassword, false);
            });
            promises.push(function () {
                return ExtendedConfigInitializerCommand.replaceTourDocSolrPasswordInBackendConfig(
                    me.configbasepath + '/backend.prod.json', newpassword, false);
            });
            promises.push(function () {
                return ConfigInitializerUtil.replaceSolrDefaultPasswordHashInSolrConfig(
                    me.solrconfigbasepath + '/security.json', solrPasswordHash, false);
            });

            promises.push(function () {
                return me.setSolrReadPasswords(newpassword, solrPasswordHash);
            });

            promises.push(function () {
                return me.setSolrWritePasswords(newpassword, solrPasswordHash);
            });

            promises.push(function () {
                return ConfigInitializerUtil.replaceSolrUserPasswordInSolrConfig(
                    me.solrconfigbasepath + '/security.json', 'mygeomadmin', solrPasswordHash, false);
            });
            promises.push(function () {
                return ConfigInitializerUtil.replaceSolrUserPasswordInSolrConfig(
                    me.solrconfigbasepath + '/security.json', 'mygeomread', solrPasswordHash, false);
            });
            promises.push(function () {
                return ConfigInitializerUtil.replaceSolrUserPasswordInSolrConfig(
                    me.solrconfigbasepath + '/security.json', 'mycmsread', solrPasswordHash, false);
            });

            return Promise_serial(promises, {parallelize: 1}).then(() => {
                return Promise.resolve('DONE - setSolrPasswords');
            }).catch(reason => {
                return Promise.reject(reason);
            });
        });
    }

    protected setSolrReadPasswords(newpassword: string, solrPasswordHash: string): Promise<any> {
        if (newpassword === undefined || newpassword.length < 8 || solrPasswordHash === undefined || solrPasswordHash.length < 8) {
            return Promise.reject('valid newpassword required');
        }

        const me = this;
        const promises = [];
        promises.push(function () {
            return ExtendedConfigInitializerCommand.replacePDocSolrPasswordInBackendConfig(
                me.configbasepath + '/backend.dev.json', newpassword, false);
        });
        promises.push(function () {
            return ExtendedConfigInitializerCommand.replacePDocSolrPasswordInBackendConfig(
                me.configbasepath + '/backend.beta.json', newpassword, false);
        });
        promises.push(function () {
            return ExtendedConfigInitializerCommand.replacePDocSolrPasswordInBackendConfig(
                me.configbasepath + '/backend.prod.json', newpassword, false);
        });

        promises.push(function () {
            return ConfigInitializerUtil.replaceSolrUserPasswordInSolrConfig(
                me.solrconfigbasepath + '/security.json', 'mygeomread', solrPasswordHash, false);
        });

        return Promise_serial(promises, {parallelize: 1}).then(() => {
            return Promise.resolve('DONE - setSolrPasswords');
        }).catch(reason => {
            return Promise.reject(reason);
        });
    }

    protected setSolrWritePasswords(newpassword: string, solrPasswordHash: string): Promise<any> {
        if (newpassword === undefined || newpassword.length < 8 || solrPasswordHash === undefined || solrPasswordHash.length < 8) {
            return Promise.reject('valid newpassword required');
        }

        const me = this;
        const promises = [];

        promises.push(function () {
            return ConfigInitializerUtil.replaceSolrPasswordInDbPublishConfig(
                me.configbasepath + '/dbpublish.json', newpassword, false);
        });
        promises.push(function () {
            return ConfigInitializerUtil.replaceSolrUserPasswordInSolrConfig(
                me.solrconfigbasepath + '/security.json', 'mygeomadmin', solrPasswordHash, false);
        });
        promises.push(function () {
            return ConfigInitializerUtil.replaceSolrUserPasswordInSolrConfig(
                me.solrconfigbasepath + '/security.json', 'mygeomupdate', solrPasswordHash, false);
        });

        return Promise_serial(promises, {parallelize: 1}).then(() => {
            return Promise.resolve('DONE - setSolrPasswords');
        }).catch(reason => {
            return Promise.reject(reason);
        });
    }

}
