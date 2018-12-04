import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {GeoDocSearchForm} from '../../../../shared/gdoc-commons/model/forms/gdoc-searchform';
import {GeoDocSearchResult} from '../../../../shared/gdoc-commons/model/container/gdoc-searchresult';
import {Facets} from '@dps/mycms-commons/dist/search-commons/model/container/facets';
import {IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts} from 'angular-2-dropdown-multiselect';
import {GeoDocSearchFormUtils} from '../../services/gdoc-searchform-utils.service';
import {GeoLocationService} from '@dps/mycms-commons/dist/commons/services/geolocation.service';
import {DomSanitizer} from '@angular/platform-browser';
import {ToastrService} from 'ngx-toastr';
import {GeoDocDataCacheService} from '../../services/gdoc-datacache.service';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {GeoDocSearchFormConverter} from '../../services/gdoc-searchform-converter.service';
import {CommonDocSearchformComponent} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-searchform/cdoc-searchform.component';
import {GeoDocRecord} from '../../../../shared/gdoc-commons/model/records/gdoc-record';
import {GeoDocDataService} from '../../../../shared/gdoc-commons/services/gdoc-data.service';

@Component({
    selector: 'app-gdoc-searchform',
    templateUrl: './gdoc-searchform.component.html',
    styleUrls: ['./gdoc-searchform.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeoDocSearchformComponent extends CommonDocSearchformComponent<GeoDocRecord, GeoDocSearchForm, GeoDocSearchResult, GeoDocDataService> {
    // initialize a private variable _searchForm, it's a BehaviorSubject
    private geoLocationService = new GeoLocationService();

    public optionsSelectWhen: IMultiSelectOption[] = [];
    public optionsSelectWhere: IMultiSelectOption[] = [];
    public optionsSelectSubType: IMultiSelectOption[] = [];
    public optionsSelectTechDataDistance: IMultiSelectOption[] = [];
    public optionsSelectTechDataAscent: IMultiSelectOption[] = [];
    public optionsSelectTechDataAltitudeMax: IMultiSelectOption[] = [];
    public optionsSelectTechDataDuration: IMultiSelectOption[] = [];

    public settingsSelectWhen = this.defaultSeLectSettings;
    public settingsSelectWhere: IMultiSelectSettings =
        {dynamicTitleMaxItems: 5,
            buttonClasses: 'btn btn-default btn-secondary text-right fullwidth btn-sm multiselect-highlight-value',
            containerClasses: 'dropdown-inline fullwidth',
            enableSearch: true,
            showUncheckAll: true,
            autoUnselect: true,
            selectionLimit: 1};
    public settingsSelectsubtype = this.defaultSeLectSettings;
    public settingsSelectTechDataDistance = this.defaultSeLectSettings;
    public settingsSelectTechDataAscent = this.defaultSeLectSettings;
    public settingsSelectTechDataAltitudeMax = this.defaultSeLectSettings;
    public settingsSelectTechDataDuration = this.defaultSeLectSettings;

    public textsSelectWhen: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Zeit ausgewählt',
        checkedPlural: 'Zeiten ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '',
        allSelected: 'Jederzeit'};
    public textsSelectWhere: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Region ausgewählt',
        checkedPlural: 'Regionen ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '',
        allSelected: 'Überall'};
    public textsSelectsubtype: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Action ausgewählt',
        checkedPlural: 'Aktion ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '',
        allSelected: 'alles'};
    public textsSelectTechDataDistance: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Strecke ausgewählt',
        checkedPlural: 'Strecke ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '',
        allSelected: 'Alle'};
    public textsSelectTechDataAscent: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Aufstieg ausgewählt',
        checkedPlural: 'Aufstieg ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '',
        allSelected: 'Alle'};
    public textsSelectTechDataAltitudeMax: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Hähe ausgewählt',
        checkedPlural: 'Höhen ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '',
        allSelected: 'Alle'};
    public textsSelectTechDataDuration: IMultiSelectTexts = { checkAll: 'Alle auswählen',
        uncheckAll: 'Alle abwählen',
        checked: 'Dauer ausgewählt',
        checkedPlural: 'Dauer ausgewählt',
        searchPlaceholder: 'Find',
        defaultTitle: '',
        allSelected: 'Alle'};

    public showWhereAvailable = true;
    public showWhenAvailable = true;

    @Input()
    public showWhere? = this.showForm;

    @Input()
    public showWhen? = this.showForm;

    constructor(sanitizer: DomSanitizer, fb: FormBuilder, searchFormUtils: SearchFormUtils,
                private gdocSearchFormUtils: GeoDocSearchFormUtils, searchFormConverter: GeoDocSearchFormConverter,
                gdocDataCacheService: GeoDocDataCacheService, toastr: ToastrService, cd: ChangeDetectorRef) {
        super(sanitizer, fb, searchFormUtils, gdocSearchFormUtils, searchFormConverter, gdocDataCacheService, toastr, cd);
        this.defaultSeLectSettings.dynamicTitleMaxItems = 2;
    }

    protected createDefaultSearchResult(): GeoDocSearchResult {
        return new GeoDocSearchResult(new GeoDocSearchForm({}), 0, undefined, new Facets());
    }

    protected createDefaultFormGroup(): any {
        return this.fb.group({
            when: [],
            where: [],
            nearby: '',
            nearbyAddress: '',
            nearbyDistance: '10',
            what: [],
            moreFilter: '',
            fulltext: '',
            techDataAscent: [],
            techDataAltitudeMax: [],
            techDataDistance: [],
            techDataDuration: [],
            techRateOverall: [],
            playlists: [],
            subtype: [],
            type: [],
            sort: '',
            perPage: 10,
            pageNum: 1
        });
    }


    public clearNearBy() {
        const me = this;
        const values = this.searchFormGroup.getRawValue();
        me.searchFormGroup.patchValue({'nearby': undefined});
        me.searchFormGroup.patchValue({'nearbyAddress': ''});
        me.doSearch();
    }

    public useBrowserGeoLocation() {
        const me = this;
        const values = this.searchFormGroup.getRawValue();
        this.geoLocationService.getCurrentPosition().toPromise().then(position => {
            const pos: Position = position;
            me.searchFormGroup.patchValue({'nearby': [pos.coords.latitude, pos.coords.longitude, values.nearbyDistance].join('_')});
            me.geoLocationService.doReverseLookup(pos.coords.latitude, pos.coords.longitude).then(function (result: any) {
                me.searchFormGroup.patchValue({'nearbyAddress':
                    GeoDocSearchForm.gdocFields.nearbyAddress.validator.sanitize(result.address)});
                me.doSearch();
            });
        });
    }

    protected updateFormGroup(gdocSearchSearchResult: GeoDocSearchResult): void {
        const values: GeoDocSearchForm = gdocSearchSearchResult.searchForm;
        this.searchFormGroup = this.fb.group({
            when: [(values.when ? values.when.split(/,/) : [])],
            what: [(values.what ? values.what.split(/,/) : [])],
            where: [(values.where ? values.where.split(/,/) : [])],
            nearbyAddress: values.nearbyAddress,
            nearbyDistance: '10',
            nearby: values.nearby,
            fulltext: values.fulltext,
            moreFilter: values.moreFilter,
            subtype: [(values.subtype ? values.subtype.split(/,/) : [])],
            techDataAscent: [(values.techDataAscent ? values.techDataAscent.split(/,/) : [])],
            techDataAltitudeMax: [(values.techDataAltitudeMax ? values.techDataAltitudeMax.split(/,/) : [])],
            techDataDistance: [(values.techDataDistance ? values.techDataDistance.split(/,/) : [])],
            techDataDuration: [(values.techDataDuration ? values.techDataDuration.split(/,/) : [])],
            playlists: [(values.playlists ? values.playlists.split(/,/) : [])],
            type: [(values.type ? values.type.split(/,/) : [])]
        });
    }

    protected updateSelectComponents(gdocSearchSearchResult: GeoDocSearchResult) {
        super.updateSelectComponents(gdocSearchSearchResult);
        const me = this;

        const rawValues = this.searchFormGroup.getRawValue();
        this.optionsSelectWhen = this.searchFormUtils.moveSelectedToTop(
            this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
                this.gdocSearchFormUtils.getWhenValues(gdocSearchSearchResult), true, [], true),
            rawValues['when']);
        this.optionsSelectWhere = this.searchFormUtils.moveSelectedToTop(
            this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
                this.gdocSearchFormUtils.getWhereValues(gdocSearchSearchResult), true, [/^_+/, /_+$/], false),
            rawValues['where']);
        this.optionsSelectSubType = this.searchFormUtils.moveSelectedToTop(
            this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
                this.gdocSearchFormUtils.getSubTypeValues(gdocSearchSearchResult), true, [], true)
                .sort(function (a, b) {
                    if (a['count'] < b['count']) {
                        return 1;
                    }
                    if (a['count'] > b['count']) {
                        return -1;
                    }
                    return a.name.localeCompare(b.name);
                }),
            rawValues['subtype']);

        this.optionsSelectTechDataDistance = this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
            this.gdocSearchFormUtils.getTechDataDistanceValues(gdocSearchSearchResult), true, [], true);
        this.optionsSelectTechDataAscent = this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
            this.gdocSearchFormUtils.getTechDataAscentValues(gdocSearchSearchResult), true, [], true);
        this.optionsSelectTechDataAltitudeMax = this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
            this.gdocSearchFormUtils.getTechDataAltitudeMaxValues(gdocSearchSearchResult), true, [], true);
        this.optionsSelectTechDataDuration = this.searchFormUtils.moveSelectedToTop(
            this.searchFormUtils.getIMultiSelectOptionsFromExtractedFacetValuesList(
                this.gdocSearchFormUtils.getTechDataDurationValues(gdocSearchSearchResult), true, [], true),
            rawValues['techDataDuration']);

        const values: GeoDocSearchForm = gdocSearchSearchResult.searchForm;
        const [lat, lon, dist] = this.gdocSearchFormUtils.extractNearbyPos(values.nearby);
        if (lat && lon && (values.nearbyAddress === undefined || values.nearbyAddress === '')) {
            this.geoLocationService.doReverseLookup(lat, lon).then(function (result: any) {
                me.searchFormGroup.patchValue({'nearbyAddress':
                        GeoDocSearchForm.gdocFields.nearbyAddress.validator.sanitize(result.address)});
            });
        }
        if (dist) {
            this.searchFormGroup.patchValue({'nearbyDistance': dist});
        }
    }

    protected updateAvailabilityFlags(gdocSearchSearchResult: GeoDocSearchResult) {
        this.showWhereAvailable = true || (this.optionsSelectWhere.length > 0);
        this.showWhenAvailable = (this.optionsSelectWhen.length > 0 || this.optionsSelectTechDataDuration.length > 0);
        this.showDetailsAvailable = (this.optionsSelectWhat.length > 0 ||
            this.optionsSelectTechDataDistance.length > 0 || this.optionsSelectTechDataAltitudeMax.length > 0 ||
            this.optionsSelectTechDataAscent.length > 0);
        this.showMetaAvailable = (this.optionsSelectPlaylists.length > 0);
    }

    protected beforeDoSearchPrepareValues(values: any) {
        values.nearby = this.gdocSearchFormUtils.joinNearbyPos(values);
        this.searchFormGroup.patchValue({'nearby': values.nearby});
    }


    updateFormState(state?: boolean): void {
        if (state !== undefined) {
            this.showForm = this.showDetails = this.showFulltext = this.showMeta = this.showSpecialFilter = this.showWhat = this.showWhen
                = this.showWhere = state;
        } else {
            this.showForm = this.showDetails || this.showFulltext || this.showMeta || this.showSpecialFilter || this.showWhat
                || this.showWhen || this.showWhere;
        }

        this.changedShowForm.emit(this.showForm);
    }

    doLocationSearch(selector) {
        const me = this;
        this.geoLocationService.doLocationSearch(selector, this.searchFormGroup.getRawValue()['nearbyAddress']).then((event: any) => {
            const distance = me.searchFormGroup.getRawValue()['nearbyDistance'] || 10;
            me.searchFormGroup.patchValue({'nearby': event.detail.lat + '_' + event.detail.lon + '_' + distance});
            me.searchFormGroup.patchValue({'nearbyAddress':
                    GeoDocSearchForm.gdocFields.nearbyAddress.validator.sanitize(event.detail.formatted)});
            me.doSearch();
        }).catch(reason => {
            console.warn('locationsearch failed', reason);
        });

        return false;
    }
}
