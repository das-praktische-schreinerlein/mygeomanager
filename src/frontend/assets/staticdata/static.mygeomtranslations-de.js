window.importStaticTranslationsJsonP = `
{
    "nav.brand.appName": "MyGeoManager",
    "meta.title.prefix.errorPage": "MyGeoManager - Oje ein Fehler",
    "meta.title.prefix.sectionPage": "MyGeoManager - {{title}}",
    "meta.title.prefix.cdocSearchPage": "MyGeoManager - Suche",
    "meta.title.prefix.cdocShowPage": "MyGeoManager - {{cdoc}}",
    "meta.title.prefix.cdocSectionSearchPage": "MyGeoManager - {{title}} - Suche",
    "meta.title.prefix.cdocSectionShowPage": "MyGeoManager - {{title}} - {{cdoc}}",
    "meta.desc.prefix.errorPage": "MyGeoManager - Oje ein Fehler ist aufgetreten",
    "meta.desc.prefix.sectionPage": "MyGeoManager - {{title}} - {{teaser}}",
    "meta.desc.prefix.cdocSearchPage": "MyGeoManager - Touren/Berichte/Regionen/Bilder/Infos",
    "meta.desc.prefix.cdocShowPage": "MyGeoManager - Infos für {{cdoc}}",
    "meta.desc.prefix.cdocSectionSearchPage": "MyGeoManager - Touren/Berichte/Regionen/Bilder/Infos zum Thema {{title}} - {{teaser}}",
    "meta.desc.prefix.cdocSectionShowPage": "MyGeoManager - {{title}} - Infos für {{cdoc}}",
    "APPNAME": "MyGeoManager",
    "listLayout_0": "\u2630 Zeile",
    "listLayout_1": "\u25A4 Liste",
    "listLayout_2": "\u25A6 Klein",
    "listLayout_3": "\u2637 Gross",
    "listLayout_4": "\u25A3 Seite",
    "listLayoutShort_0": "\u2630",
    "listLayoutShort_1": "\u25A4",
    "listLayoutShort_2": "\u25A6",
    "listLayoutShort_3": "\u2637",
    "listLayoutShort_4": "\u25A3",
    "listSorts_relevance": "Relevanz",
    "listSorts_forExport": "Für Export",
    "listSorts_date": "Datum absteigend",
    "listSorts_dateDesc": "Datum absteigend",
    "listSorts_dateAsc": "Datum aufsteigend",
    "listSorts_file": "Dateiname",
    "listSorts_order": "Order",
    "listSorts_persRate": "Bewertung",
    "listSorts_name": "Name",
    "listSorts_type": "Typ",
    "listSorts_subtype": "Art",
    "ac_0": "Unbestimmt",
    "ac_1": "Rad-Tour",
    "loc_1": "Unbestimmt",
    "hrt_search": "Suche",
    "hrt_type": "nach",
    "hrt_alltypes": "nach Allem",
    "hrt_in": "in",
    "hrt_initial": "Initial",
    "hrt_nearby": "nahe",
    "hrt_subtype": "mit Aktionen:",
    "hrt_when": "im Zeitraum:",
    "hrt_keyword": "mit Schlüsselworten:",
    "hrt_fulltext": "enthält:",
    "hrt_moreFilter": "zusätzlich gefiltert nach:",
    "hrt_ele": "max Höhe:"
}
`;

var script = document.createElement('script');
script.type='application/json';
script.id = 'assets/staticdata/static.mygeomtranslations-de.js';
var text = document.createTextNode(importStaticTranslationsJsonP);
script.appendChild(text);
document.head.appendChild(script);
