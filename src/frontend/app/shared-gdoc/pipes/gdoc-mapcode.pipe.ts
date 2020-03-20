import {Pipe, PipeTransform} from '@angular/core';
import {GeoDocRecord} from '../../../shared/gdoc-commons/model/records/gdoc-record';
import {StringUtils} from '@dps/mycms-commons/dist/commons/utils/string.utils';

@Pipe({
    name: 'gdocmapcode'
})
export class GeoDocMapCodePipe implements PipeTransform {
    transform(value: GeoDocRecord, ...args: any[]): string {
        if (value && (value.geoLat || value.gpsTrackSrc || value.gpsTrackBasefile) && args.length > 0) {
            const prefix = args.length > 1 && args[1] !== '' ? args[1] : '';
            return prefix + StringUtils.calcCharCodeForListIndex(args[0]);
        }

        return '';
    }
}
