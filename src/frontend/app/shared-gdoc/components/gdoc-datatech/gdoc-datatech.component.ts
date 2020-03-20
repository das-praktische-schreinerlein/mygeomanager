import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {GeoDocRecord} from '../../../../shared/gdoc-commons/model/records/gdoc-record';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';

@Component({
    selector: 'app-gdoc-datatech',
    templateUrl: './gdoc-datatech.component.html',
    styleUrls: ['./gdoc-datatech.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeoDocDataTechComponent extends AbstractInlineComponent {
    gdocdatatech: GeoDocRecord;

    @Input()
    public record: GeoDocRecord;

    @Input()
    public small? = false;

    constructor(protected cd: ChangeDetectorRef) {
        super(cd);
    }

    protected updateData(): void {
        if (this.record === undefined) {
            this.gdocdatatech = undefined;
            return;
        }

        this.gdocdatatech = this.record;
    }
}
