import {IdValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {isArray} from 'util';
import {DateUtils} from '@dps/mycms-commons/dist/commons/utils/date.utils';

export class GeoDocFileUtils {
    public static normalizeCygwinPath(path: string): string {
        if (!path) {
            return path;
        }

        path = path.replace(/^\/cygdrive\/([a-z])\//g, '$1:/');

        return path;
    }

    public static parseRecordSourceFromJson(json: string): any[] {
        let data = JSON.parse(json);
        const records = [];
        const idValidator = new IdValidationRule(true);
        const mapping = {
            // facets
            loc_lochirarchie_txt: 'loc_lochirarchie_s',
            loc_id_is: 'loc_id_i',
        };

        if (data.gdocs) {
            data = data.gdocs;
        }
        if (!isArray(data)) {
            throw new Error('no valid data to import: no array of gdocs');
        }
        data.forEach(record => {
            for (const fieldName in mapping) {
                record[fieldName] = record[mapping[fieldName]];
            }
            record['id'] = idValidator.sanitize(record['id'] + '');
            record['subtype_s'] = record['subtype_s'] ? record['subtype_s'].replace(/[-a-zA-Z_]+/g, '') : '';

            // clean keywords
            record['keywords_txt'] = (record['keywords_txt'] !== undefined ?
                record['keywords_txt'].replace(/^,/g, '').replace(/,$/g, '').replace(/,,/g, ',') : '');

            // calc facets

            for (const dateField of ['dateshow_dt']) {
                if (record[dateField] !== undefined && record[dateField] !== '') {
                    record[dateField] = DateUtils.parseDateStringWithLocaltime(record[dateField]);
                }
            }

            records.push(record);
        });

        return records;
    }
}
