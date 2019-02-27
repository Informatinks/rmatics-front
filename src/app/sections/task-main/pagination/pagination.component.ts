import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

interface Link {
  href: string;
  name: string;
}

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  @Input() next?: Link;
  @Input() previous?: Link;

  get previousLink () {
    return this.previous ? this.previous.href : '';
  }
  get previousName () {
    return this.previous ? this.previous.name : '';
  }
  get nextLink () {
    return this.next ? this.next.href : '';
  }
  get nextName () {
    return this.next ? this.next.name : '';
  }
}
