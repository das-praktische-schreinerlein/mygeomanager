import minimist from 'minimist';
import {SiteMapGeneratorCommand} from './commands/sitemap-generator.command';
import {utils} from 'js-data';
import {GeoDocLoaderCommand} from "./commands/gdoc-loader.command";
import {GeoDocExporterCommand} from "./commands/gdoc-exporter.command";
import {GeoDocConverterCommand} from "./commands/gdoc-converter.command";

const argv = minimist(process.argv.slice(2));

// disable debug-logging
const debug = argv['debug'] || false;
if (!debug) {
    console.log = function() {};
}
if (!debug || debug === false || parseInt(debug, 10) < 1) {
    console.trace = function() {};
    console.debug = function() {};
}

const gdocConverter = new GeoDocConverterCommand();
const gdocLoader = new GeoDocLoaderCommand();
const gdocExporter = new GeoDocExporterCommand();
const siteMapGenerator = new SiteMapGeneratorCommand();

let promise: Promise<any>;
switch (argv['command']) {
    case 'generateSitemap':
        promise = siteMapGenerator.process(argv);
        break;
    case 'convertGeoDoc':
        promise = gdocConverter.process(argv);
        break;
    case 'loadGeoDoc':
        promise = gdocLoader.process(argv);
        break;
    case 'exportGeoDoc':
        promise = gdocExporter.process(argv);
        break;
    default:
        console.error('unknown command:', argv);
        promise = utils.reject('unknown command');
}

promise.then(value => {
    console.log('DONE - command finished:', value, argv);
    process.exit(0);
}).catch(reason => {
    console.error('ERROR - command failed:', reason, argv);
    process.exit(-1);
});
