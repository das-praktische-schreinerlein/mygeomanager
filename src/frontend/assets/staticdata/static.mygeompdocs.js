window.importStaticDataPDocsJsonP = `
{
 "pdocs": [
  {
   "id": "menu",
   "descMd": "Hauptmenü",
   "flgShowTopTen": false,
   "flgShowSearch": false,
   "heading": "Hauptmenü",
   "name": "Hauptmenü",
   "subSectionIds": "start",
   "teaser": "Hauptmenü",
   "type": "SectionOverviewPage"
  },
  {
   "id": "start",
   "descMd": "# MyGeoManager \\n\\n Ein Werkzeug zur POI-Suche.",
   "flgShowTopTen": false,
   "flgShowNews": false,
   "flgShowSearch": true,
   "flgShowAdminArea": true,
   "heading": "Thats MyGeoManager",
   "name": "Willkommen",
   "subSectionIds": "",
   "teaser": "Willkommen bei MyGeoManager",
   "type": "SectionOverviewPage"
  },
  {
   "id": "impress",
   "descMd": "# Hier kommt das Impressum hin.",
   "flgShowTopTen": false,
   "flgShowSearch": false,
   "heading": "Impressum/Datenschutz",
   "name": "Impressum/Datenschutz",
   "subSectionIds": "",
   "teaser": "Impressum/Datenschutz - der rechtliche Teil",
   "type": "SimplePage"
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
