window.importStaticConfigJsonP = `
{
    "skipMediaCheck": false,
    "staticPDocsFile": "assets/staticdata/static.mygeompdocs.js",
    "staticGDocsFiles": [
        "assets/staticdata/static.mygeomgdocs_searchresult.js",
        "assets/staticdata/samples-static.mygeomgdocs_pois_export_chunk0.js"
    ],
    "components": {
        "gdoc-keywords": {
            "editPrefix": "",
            "possiblePrefixes": [""],
            "structuredKeywords": [
                {"name": "Natur", "keywords": ["Alm", "Aue", "Bach", "Fluss", "Moor", "See",
                    "Teich", "Wasserfall", "Felsen", "Felswand", "Gletscherschau",
                    "Höhle", "Schlucht", "Tal", "Sandstrand", "Steinstrand",
                    "Steilküste", "Blumen", "Feld", "Heide", "Steppe", "Wiese",
                    "Bergwald", "Strandwald", "Wald", "Seenlandschaft", "Berge",
                    "Hochgebirge", "Mittelgebirge", "Meer", "Ozean", "Firn", "Schneefelder"]}
            ],
            "keywordSuggestions": [
                {   "name": "Action Rad-Tour", "keywords": ["Radfahren"],
                    "filters": [{ "property": "subtype", "command": "CSVIN", "expectedValues": ["1"]}]
                }
            ],
            "blacklist": ["OFFEN", "Mom", "Pa", "Micha"]
        },
        "gdoc-actions": {
            "actionTags": [
                {
                    "key": "local_album_current",
                    "type": "albumtag",
                    "name": "local Album",
                    "shortName": "&#x2764",
                    "payload": {
                        "albumkey": "Current"
                    },
                    "showFilter": [
                        {
                            "property": "localalbum",
                            "command": "CSVIN",
                            "expectedValues": ["Current"]
                        }
                    ],
                    "recordAvailability": [
                        {
                            "property": "type",
                            "command": "CSVIN",
                            "expectedValues": ["POI", "poi"]
                        }
                    ],
                    "configAvailability": [
                        {
                            "property": "gdocMaxItemsPerAlbum",
                            "command": "GE",
                            "expectedValues": [10]
                        }
                    ]
                }

            ]
        },
        "gdoc-multiactionheader": {
            "actionTags": [
                {
                    "key": "local_album_current",
                    "type": "albumtag",
                    "name": "set local Album",
                    "shortName": "&#x2764",
                    "payload": {
                        "albumkey": "Current",
                        "set": true
                    },
                    "showFilter": [
                    ],
                    "profileAvailability": [
                        {
                            "property": "type",
                            "command": "NEQ",
                            "expectedValues": ["albumpage"]
                        }
                    ],
                    "recordAvailability": [
                        {
                            "property": "type",
                            "command": "CSVIN",
                            "expectedValues": ["POI", "poi"]
                        }
                    ],
                    "configAvailability": [
                        {
                            "property": "gdocMaxItemsPerAlbum",
                            "command": "GE",
                            "expectedValues": [10]
                        }
                    ]
                },
                {
                    "key": "unset_local_album_current",
                    "type": "albumtag",
                    "name": "unset local Album",
                    "shortName": "&#x2764",
                    "payload": {
                        "albumkey": "Current",
                        "set": false
                    },
                    "showFilter": [
                    ],
                    "profileAvailability": [
                    ],
                    "recordAvailability": [
                        {
                            "property": "type",
                            "command": "CSVIN",
                            "expectedValues": ["POI", "poi"]
                        }
                    ],
                    "configAvailability": [
                        {
                            "property": "gdocMaxItemsPerAlbum",
                            "command": "GE",
                            "expectedValues": [10]
                        }
                    ]
                }
            ]
        },
        "gdoc-showpage": {
            "showBigImages": false,
            "allowedQueryParams": [],
            "availableTabs": {
                "POI": true
            }
        },
        "gdoc-albumpage": {
            "allowAutoplay": false,
            "m3uAvailable": false
        },
        "cdoc-listheader": {
            "allowAutoplay": false
        },
        "pdoc-sectionpage": {
            "availableTabs": {
                "POI": true,
                "ALL": true
            }
        }
    },
    "services": {
        "seo": {
            "gdocIndexableTypes": [
                "POI"
            ]
        },
        "serverItemExport": {
            "maxAllowedM3UItems": 0
        },
        "adminJobArea": {
            "jobsAllowed": false
        },
        "global": {
            "hideCopyrightFooter": true
        }
    }
}
`;

var script = document.createElement('script');
script.type='application/json';
script.id = 'assets/staticdata/static.mygeomconfig.js';
var text = document.createTextNode(importStaticConfigJsonP);
script.appendChild(text);
document.head.appendChild(script);
