window.importStaticDataPDocsJsonP = `
{
 "pdocs": [
  {
   "id": "PAGE_1",
   "descMd": "Hauptmenü",
   "heading": "Hauptmenü",
   "name": "Hauptmenü",
   "subSectionIds": "start",
   "teaser": "Hauptmenü",
   "type": "PAGE",
   "flags": "",
   "profiles": "profile_viewer,profile_static,profile_dev,profile_beta,profile_prod",
   "langkeys": "lang_de,lang_en",
   "subtype": "SectionOverviewPage",
   "key": "menu"
  },
  {
   "id": "PAGE_2",
   "descMd": "# MyGeoManager \\n\\n Ein Werkzeug zur POI-Suche.",
   "heading": "Thats MyGeoManager",
   "name": "Willkommen",
   "subSectionIds": "",
   "teaser": "Willkommen bei MyGeoManager",
   "type": "PAGE",
   "flags": "flg_ShowSearch,flg_ShowAdminArea",
   "profiles": "profile_viewer,profile_static,profile_dev,profile_beta,profile_prod",
   "langkeys": "lang_de,lang_en",
   "subtype": "SectionOverviewPage",
   "key": "start"
  },
  {
   "id": "PAGE_3",
   "descMd": "# Bitte gehen sie weiter, hier gibt es NICHTS zu sehen!!!.",
   "heading": "Impressum/Datenschutz",
   "name": "Impressum/Datenschutz",
   "subSectionIds": "",
   "teaser": "Impressum/Datenschutz - der rechtliche Teil",
   "type": "PAGE",
   "flags": "",
   "profiles": "profile_viewer,profile_static,profile_dev,profile_beta,profile_prod",
   "langkeys": "lang_de,lang_en",
   "subtype": "SimplePage",
   "key": "impress"
  }
 ]
}
`;

var script = document.createElement('script');
script.type='application/json';
script.id = 'assets/staticdata/static.mygeompdocs.js';
var text = document.createTextNode(importStaticDataPDocsJsonP);
script.appendChild(text);
document.head.appendChild(script);
