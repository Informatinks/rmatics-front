import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
    selector: 'app-checkbox-demo',
    templateUrl: './checkbox-demo.component.html',
    styleUrls: ['./checkbox-demo.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxDemoComponent {}
