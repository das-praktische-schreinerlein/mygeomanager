window.importStaticDataGDocsJsonP = `{
    "recordCount": 0,
    "searchForm": {
    },
    "currentRecords": [
    ],
    "facets": {
        "facets": {
        },
        "selectLimits": {
            "type_txt": 1
        }
    }
}
`;

var script = document.createElement('script');
script.type='application/json';
script.id = 'assets/staticdata/static.mygeomgdocs_searchresult.js';
var text = document.createTextNode(importStaticDataGDocsJsonP);
script.appendChild(text);
document.head.appendChild(script);
