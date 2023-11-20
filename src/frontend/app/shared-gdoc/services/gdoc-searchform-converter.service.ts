import {Injectable} from '@angular/core';
import {GeoDocSearchForm, GeoDocSearchFormValidator} from '../../../shared/gdoc-commons/model/forms/gdoc-searchform';
import {
    GenericSearchFormConverter,
    HumanReadableFilter
} from '@dps/mycms-commons/dist/search-commons/services/generic-searchform.converter';
import {SearchParameterUtils} from '@dps/mycms-commons/dist/search-commons/services/searchparameter.utils';
import {TranslateService} from '@ngx-translate/core';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';

@Injectable()
export class GeoDocSearchFormConverter implements GenericSearchFormConverter<GeoDocSearchForm> {
    public HRD_IDS = {
        loc_id_i: 'LOCATION',
        loc_lochirarchie_ids_txt: 'LOCATION',
        loc_parent_id_i: 'LOCATION'};

    private splitter = '_,_';
    constructor(private searchParameterUtils: SearchParameterUtils, private translateService: TranslateService,
                private searchFormUtils: SearchFormUtils) {
    }

    isValid(searchForm: GeoDocSearchForm): boolean {
        return GeoDocSearchFormValidator.isValid(searchForm);
    }

    newSearchForm(values: {}): GeoDocSearchForm {
        return new GeoDocSearchForm(values);
    }

    joinWhereParams(gdocSearchForm: GeoDocSearchForm): string {
        const searchForm = (gdocSearchForm ? gdocSearchForm : new GeoDocSearchForm({}));
        const whereMap = new Map();
        whereMap.set('locId', searchForm.locId);
        whereMap.set('loc', searchForm.where);
        whereMap.set('nearby', searchForm.nearby);
        whereMap.set('nearbyAddress', searchForm.nearbyAddress);
        return this.searchParameterUtils.joinParamsToOneRouteParameter(whereMap, this.splitter);
    }

    joinMoreFilterParams(gdocSearchForm: GeoDocSearchForm): string {
        const searchForm = (gdocSearchForm ? gdocSearchForm : new GeoDocSearchForm({}));
        const moreFilterMap = new Map();
        moreFilterMap.set('ele', searchForm.ele);
        let moreFilter = this.searchParameterUtils.joinParamsToOneRouteParameter(moreFilterMap, this.splitter);
        if (moreFilter !== undefined && moreFilter.length > 0) {
            if (searchForm.moreFilter !== undefined && searchForm.moreFilter.length > 0) {
                moreFilter = [moreFilter, searchForm.moreFilter].join(this.splitter);
            }
        } else {
            moreFilter = searchForm.moreFilter;
        }
        return moreFilter;
    }

    joinWhatParams(gdocSearchForm: GeoDocSearchForm): string {
        const searchForm = (gdocSearchForm ? gdocSearchForm : new GeoDocSearchForm({}));
        const whatMap = new Map();
        whatMap.set('keyword', searchForm.what);
        whatMap.set('action', searchForm.subtype);
        whatMap.set('playlists', searchForm.playlists);
        return this.searchParameterUtils.joinParamsToOneRouteParameter(whatMap, this.splitter);
    }

    searchFormToValueMap(gdocSearchForm: GeoDocSearchForm): {[key: string]: string } {
        const searchForm = (gdocSearchForm ? gdocSearchForm : new GeoDocSearchForm({}));

        const where = this.joinWhereParams(searchForm);
        const moreFilter = this.joinMoreFilterParams(searchForm);
        const what = this.joinWhatParams(searchForm);

        const params: {[key: string]: string } = {
            when: this.searchParameterUtils.joinAndUseValueOrDefault(searchForm.when, 'jederzeit'),
            where: this.searchParameterUtils.joinAndUseValueOrDefault(where, 'ueberall'),
            what: this.searchParameterUtils.joinAndUseValueOrDefault(what, 'alles'),
            fulltext: this.searchParameterUtils.joinAndUseValueOrDefault(searchForm.fulltext, 'egal'),
            moreFilter: this.searchParameterUtils.joinAndUseValueOrDefault(moreFilter, 'ungefiltert'),
            sort: this.searchParameterUtils.joinAndUseValueOrDefault(searchForm.sort, 'relevance'),
            type: this.searchParameterUtils.joinAndUseValueOrDefault(searchForm.type, 'alle'),
            perPage: (+searchForm.perPage || 10) + '',
            pageNum: (+searchForm.pageNum || 1) + ''
        };

        return params;
    }

    searchFormToUrl(baseUrl: string, gdocSearchForm: GeoDocSearchForm): string {
        let url = baseUrl + 'search/';
        const searchForm = (gdocSearchForm ? gdocSearchForm : new GeoDocSearchForm({}));

        const where = this.joinWhereParams(searchForm);
        const moreFilter = this.joinMoreFilterParams(searchForm);
        const what = this.joinWhatParams(searchForm);

        const params: Object[] = [
            this.searchParameterUtils.joinAndUseValueOrDefault(searchForm.when, 'jederzeit'),
            this.searchParameterUtils.joinAndUseValueOrDefault(where, 'ueberall'),
            this.searchParameterUtils.joinAndUseValueOrDefault(what, 'alles'),
            this.searchParameterUtils.joinAndUseValueOrDefault(searchForm.fulltext, 'egal'),
            this.searchParameterUtils.joinAndUseValueOrDefault(moreFilter, 'ungefiltert'),
            this.searchParameterUtils.joinAndUseValueOrDefault(searchForm.sort, 'relevance'),
            this.searchParameterUtils.joinAndUseValueOrDefault(searchForm.type, 'alle'),
            +searchForm.perPage || 10,
            +searchForm.pageNum || 1
        ];
        url += params.join('/');

        return url;
    }

    paramsToSearchForm(params: any, defaults: {}, searchForm: GeoDocSearchForm): void {
        params = params || {};
        defaults = defaults || {};
        const whereValues = this.searchParameterUtils.splitValuesByPrefixes(params.where, this.splitter,
            ['locId:', 'loc:', 'nearby:', 'nearbyAddress:']);
        let where = '';
        if (whereValues.has('loc:')) {
            where = this.searchParameterUtils.joinValuesAndReplacePrefix(whereValues.get('loc:'), 'loc:', ',');
        }
        if (whereValues.has('unknown')) {
            where += ',' + this.searchParameterUtils.joinValuesAndReplacePrefix(whereValues.get('unknown'), '', ',');
        }
        where = where.replace(/[,]+/g, ',').replace(/(^,)|(,$)/g, '');
        const nearby: string = (whereValues.has('nearby:') ?
            this.searchParameterUtils.joinValuesAndReplacePrefix(whereValues.get('nearby:'), 'nearby:', ',') : '');
        const nearbyAddress: string = (whereValues.has('nearbyAddress:') ?
            this.searchParameterUtils.joinValuesAndReplacePrefix(whereValues.get('nearbyAddress:'), 'nearbyAddress:', ',') : '');
        const locId: string = (whereValues.has('locId:') ?
            this.searchParameterUtils.joinValuesAndReplacePrefix(whereValues.get('locId:'), 'locId:', ',') : '');

        const moreFilterValues = this.searchParameterUtils.splitValuesByPrefixes(params.moreFilter, this.splitter,
            ['ele:']);
        let moreFilter = '';
        if (moreFilterValues.has('unknown')) {
            moreFilter += ',' + this.searchParameterUtils.joinValuesAndReplacePrefix(moreFilterValues.get('unknown'), '', ',');
        }
        moreFilter = moreFilter.replace(/[,]+/g, ',').replace(/(^,)|(,$)/g, '');
        const ele: string = (moreFilterValues.has('ele:') ?
            this.searchParameterUtils.joinValuesAndReplacePrefix(
                moreFilterValues.get('ele:'), 'ele:', ',') : '');

        const whatFilterValues = this.searchParameterUtils.splitValuesByPrefixes(params.what, this.splitter,
            ['action:', 'keyword:', 'playlists:']);
        let whatFilter = '';
        if (whatFilterValues.has('unknown')) {
            whatFilter += ',' + this.searchParameterUtils.joinValuesAndReplacePrefix(whatFilterValues.get('unknown'), '', ',');
        }
        whatFilter = whatFilter.replace(/[,]+/g, ',').replace(/(^,)|(,$)/g, '');
        const what: string = (whatFilterValues.has('keyword:') ?
            this.searchParameterUtils.joinValuesAndReplacePrefix(
                whatFilterValues.get('keyword:'), 'keyword:', ',') : '');
        const subtype: string = (whatFilterValues.has('action:') ?
            this.searchParameterUtils.joinValuesAndReplacePrefix(whatFilterValues.get('action:'), 'action:', ',') : '');
        const playlists: string = (whatFilterValues.has('playlists:') ?
            this.searchParameterUtils.joinValuesAndReplacePrefix(whatFilterValues.get('playlists:'), 'playlists:', ',') : '');

        searchForm.theme = this.searchParameterUtils.useValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(params['theme'], /^alle$/, ''),
            defaults['theme'], '');
        searchForm.when = this.searchParameterUtils.useValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(params['when'], /^jederzeit$/, ''),
            defaults['when'], '');
        searchForm.where = this.searchParameterUtils.useValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(where, /^ueberall$/, ''),
            defaults['where'], '');
        searchForm.locId = this.searchParameterUtils.useValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(locId, /^ueberall$/, ''),
            defaults['locId'], '');
        searchForm.nearby = this.searchParameterUtils.useValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(nearby, /^ueberall$/, ''),
            defaults['nearby'], '');
        searchForm.nearbyAddress = this.searchParameterUtils.useValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(nearbyAddress, /^ueberall$/, ''),
            defaults['nearbyAddress'], '');
        searchForm.what = this.searchParameterUtils.useValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(what, /^alles$/, ''),
            defaults['what'], '');
        searchForm.subtype = this.searchParameterUtils.useValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(subtype, /^alles$/, ''),
            defaults['subtype'], '');
        searchForm.playlists = this.searchParameterUtils.useValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(playlists, /^alles$/, ''),
            defaults['playlists'], '');
        searchForm.fulltext = this.searchParameterUtils.useValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(params['fulltext'], /^egal$/, ''),
            defaults['fulltext'], '');
        searchForm.moreFilter = this.searchParameterUtils.useValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(moreFilter, /^ungefiltert$/, ''),
            defaults['moreFilter'], '');
        searchForm.ele = this.searchParameterUtils.useValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(ele, /^ungefiltert$/, ''),
            defaults['ele'], '');
        searchForm.sort = this.searchParameterUtils.useValueDefaultOrFallback(params['sort'], defaults['sort'], '');
        searchForm.type = this.searchParameterUtils.useValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(params['type'], /^alle$/, ''), defaults['type'], '').toLowerCase();
        searchForm.perPage = +params['perPage'] || 10;
        searchForm.pageNum = +params['pageNum'] || 1;
    }

    searchFormToHumanReadableText(filters: HumanReadableFilter[], textOnly: boolean, obJCache: Map<string, string>): string {
        return this.searchFormUtils.searchFormToHumanReadableMarkup(filters, true, obJCache, this.getHrdIds());
    }

    searchFormToHumanReadableFilter(gdocSearchForm: GeoDocSearchForm): HumanReadableFilter[] {
        const searchForm = (gdocSearchForm ? gdocSearchForm : new GeoDocSearchForm({}));

        const res: HumanReadableFilter[] = [];
        res.push(this.translateService.instant('hrt_search') || 'search');
        res.push(this.searchFormUtils.valueToHumanReadableText(gdocSearchForm.type, 'hrt_type', 'hrt_alltypes', true));
        res.push(this.searchFormUtils.valueToHumanReadableText(gdocSearchForm.where, 'hrt_in', undefined, true));
        res.push(this.searchFormUtils.valueToHumanReadableText(gdocSearchForm.nearbyAddress, 'hrt_nearby', undefined, true));
        res.push(this.searchFormUtils.valueToHumanReadableText(gdocSearchForm.subtype, 'hrt_subtype', undefined, true));

        const when = (gdocSearchForm.when ? gdocSearchForm.when : '')
            .replace(new RegExp('year', 'g'), '')
            .replace(new RegExp('month', 'g'), 'Monat')
            .replace(new RegExp('week', 'g'), 'Woche');
        res.push(this.searchFormUtils.valueToHumanReadableText(when, 'hrt_when', undefined, true));
        const what = (gdocSearchForm.what ? gdocSearchForm.what : '').replace(new RegExp('kw_', 'gi'), '');
        res.push(this.searchFormUtils.valueToHumanReadableText(what, 'hrt_keyword', undefined, true));

        const moreFilterValues = this.searchParameterUtils.splitValuesByPrefixes(gdocSearchForm.moreFilter, this.splitter,
            Object.getOwnPropertyNames(this.getHrdIds()));
        moreFilterValues.forEach((value, key) => {
            const moreValue = this.searchParameterUtils.joinValuesAndReplacePrefix(moreFilterValues.get(key), key + ':', ',');
            res.push(this.searchFormUtils.valueToHumanReadableText(moreValue, key === 'unknown' ? 'hrt_moreFilter' : 'hrt_' + key,
                undefined, true));
        });

        res.push(this.searchFormUtils.valueToHumanReadableText(gdocSearchForm.fulltext, 'hrt_fulltext', undefined, true));
        res.push(this.searchFormUtils.valueToHumanReadableText(gdocSearchForm.ele, 'hrt_ele',
            undefined, true));
        res.push(this.searchFormUtils.valueToHumanReadableText(gdocSearchForm.playlists, 'hrt_playlists', undefined, true));

        return res;
    }

    getHrdIds(): {} {
        return this.HRD_IDS;
    }

}
