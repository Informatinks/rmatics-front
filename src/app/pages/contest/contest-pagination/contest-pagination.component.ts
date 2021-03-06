import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

interface ILink {
    href: string;
    name: string;
}

@Component({
    selector: 'app-contest-pagination',
    templateUrl: './contest-pagination.component.html',
    styleUrls: ['./contest-pagination.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContestPaginationComponent {
    @Input() next?: ILink;
    @Input() previous?: ILink;

    get previousLink() {
        return this.previous ? this.previous.href : '';
    }
    get previousName() {
        return this.previous ? this.previous.name : '';
    }
    get nextLink() {
        return this.next ? this.next.href : '';
    }
    get nextName() {
        return this.next ? this.next.name : '';
    }
}
