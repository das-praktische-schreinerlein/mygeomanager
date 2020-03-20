import {
    GenericSearchForm,
    GenericSearchFormFieldConfig
} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-searchform';
import {
    GenericValidatorDatatypes,
    IdCsvValidationRule,
    KeyParamsValidationRule,
    NearbyParamValidationRule,
    TextValidationRule
} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {
    CommonDocSearchForm,
    CommonDocSearchFormFactory,
    CommonDocSearchFormValidator
} from '@dps/mycms-commons/dist/search-commons/model/forms/cdoc-searchform';
import {NumberValidationRule} from "@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util";

export class GeoDocSearchForm extends CommonDocSearchForm {
    static gdocFields = {
        where: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.LOCATION_KEY_CSV, new KeyParamsValidationRule(false)),
        locId: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.ID_CSV, new IdCsvValidationRule(false)),
        nearby: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.NEARBY, new NearbyParamValidationRule(false)),
        nearbyAddress: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.ADDRESS, new TextValidationRule(false)),
        ele: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.ID_CSV, new IdCsvValidationRule(false)),
        subtype: new GenericSearchFormFieldConfig(GenericValidatorDatatypes.ID_CSV, new IdCsvValidationRule(false))
    };

    where: string;
    locId: string;
    nearby: string;
    nearbyAddress: string;
    ele: string;
    subtype: string;

    constructor(values: {}) {
        super(values);
        GenericSearchForm.genericFields.perPage = new GenericSearchFormFieldConfig(GenericValidatorDatatypes.PERPAGE, new NumberValidationRule(false, 0, 1000, 100))
        this.where = values['where'] || '';
        this.locId = values['locId'] || '';
        this.nearby = values['nearby'] || '';
        this.nearbyAddress = values['nearbyAddress'] || '';
        this.ele = values['ele'] || '';
        this.subtype = values['subtype'] || '';
    }

    toString() {
        return 'GeoDocSearchForm {\n' +
            '  when: ' + this.when + '\n' +
            '  where: ' + this.where + '\n' +
            '  locId: ' + this.locId + '\n' +
            '  nearby: ' + this.nearby + '\n' +
            '  nearbyAddress: ' + this.nearbyAddress + '\n' +
            '  what: ' + this.what + '\n' +
            '  fulltext: ' + this.fulltext + '\n' +
            '  subtype: ' + this.subtype + '\n' +
            '  type: ' + this.type + '\n' +
            '  sort: ' + this.sort + '\n' +
            '  perPage: ' + this.perPage + '\n' +
            '  pageNum: ' + this.pageNum + '' +
            '}';
    }
}

export class GeoDocSearchFormFactory {
    static getSanitizedValues(values: {}): any  {
        const sanitizedValues = CommonDocSearchFormFactory.getSanitizedValues(values);

        sanitizedValues.where = GeoDocSearchForm.gdocFields.where.validator.sanitize(values['where']) || '';
        sanitizedValues.locId = GeoDocSearchForm.gdocFields.locId.validator.sanitize(values['locId']) || '';
        sanitizedValues.nearby = GeoDocSearchForm.gdocFields.nearby.validator.sanitize(values['nearby']) || '';
        sanitizedValues.nearbyAddress = GeoDocSearchForm.gdocFields.nearbyAddress.validator.sanitize(values['nearbyAddress']) || '';
        sanitizedValues.ele =
            GeoDocSearchForm.gdocFields.ele.validator.sanitize(values['ele']) || '';
        sanitizedValues.subtype = GeoDocSearchForm.gdocFields.subtype.validator.sanitize(values['subtype']) || '';

        return sanitizedValues;
    }

    static getSanitizedValuesFromForm(searchForm: GeoDocSearchForm): any {
        return GeoDocSearchFormFactory.getSanitizedValues(searchForm);
    }

    static createSanitized(values: {}): GeoDocSearchForm {
        const sanitizedValues = GeoDocSearchFormFactory.getSanitizedValues(values);

        return new GeoDocSearchForm(sanitizedValues);
    }

    static cloneSanitized(searchForm: GeoDocSearchForm): GeoDocSearchForm {
        const sanitizedValues = GeoDocSearchFormFactory.getSanitizedValuesFromForm(searchForm);

        return new GeoDocSearchForm(sanitizedValues);
    }
}

export class GeoDocSearchFormValidator {
    static isValidValues(values: {}): boolean {
        let state = CommonDocSearchFormValidator.isValidValues(values);
        state = GeoDocSearchForm.gdocFields.where.validator.isValid(values['where']) && state;
        state = GeoDocSearchForm.gdocFields.locId.validator.isValid(values['locId']) && state;
        state = GeoDocSearchForm.gdocFields.nearby.validator.isValid(values['nearby']) && state;
        state = GeoDocSearchForm.gdocFields.nearbyAddress.validator.isValid(values['nearbyAddress']) && state;
        state = GeoDocSearchForm.gdocFields.ele.validator.isValid(values['ele']) && state;
        state = GeoDocSearchForm.gdocFields.subtype.validator.isValid(values['subtype']) && state;

        return state;
    }

    static isValid(searchForm: GeoDocSearchForm): boolean {
        return GeoDocSearchFormValidator.isValidValues(searchForm);
    }
}
