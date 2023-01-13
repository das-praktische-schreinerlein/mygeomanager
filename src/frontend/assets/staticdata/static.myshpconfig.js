window.importStaticConfigJsonP = `
{
    "components": {
        "pdoc-sectionpage": {
        }
    },
    "services": {
        "adminJobArea": {
            "jobsAllowed": false
        }
    }
}
`;

var script = document.createElement('script');
script.type='application/json';
script.id = 'assets/staticdata/static.myshpconfig.js';
var text = document.createTextNode(importStaticConfigJsonP);
script.appendChild(text);
document.head.appendChild(script);
