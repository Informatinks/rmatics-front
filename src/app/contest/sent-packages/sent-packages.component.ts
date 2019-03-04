import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { getDate } from 'src/app/utils/getDate';

import { Submission } from '../contest.types';

type sortFields = 'date' | 'score';

interface LastSorted {
  field: sortFields;
  reverse: boolean;
}

const minPageSize = 5;

@Component({
  selector: 'app-sent-packages',
  templateUrl: './sent-packages.component.html',
  styleUrls: ['./sent-packages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SentPackagesComponent {
  _submisions: Submission[] = [];
  get submissions(): Submission[]  {
    return this._submisions;
  }

  @Input('submissions')
  set submissions(value: Submission[] ) {
    this._submisions = value.sort(this.compare(this.lastSorted.field, this.lastSorted.reverse));
  }

  @Input() problemId!: number;
  @Output() updateSubmissions = new EventEmitter();

  getDate = getDate;
  lastSorted: LastSorted = { field: 'date', reverse: false };
  pageSize = minPageSize;

  constructor() {}

  get sortedDate() {
    return this.lastSorted.field === 'date' && this.lastSorted.reverse;
  }

  get sortedScore() {
    return this.lastSorted.field === 'score' && this.lastSorted.reverse;
  }

  compare = (field: sortFields, reverse = false) => (a: Submission, b: Submission): number => {
    this.lastSorted = { field, reverse };

    const diff = a[field] - b[field];

    if (diff === 0) {
      return (reverse ? 1 : -1) * a.id - b.id;
    }
    return (reverse ? 1 : -1) * diff;
  }

  changePageSize() {
    this.pageSize = this.pageSize + minPageSize;
  }

  handleSort = (field: sortFields) => {
    const reverse = this.lastSorted.field === field ? !this.lastSorted.reverse : false;
    this.lastSorted = { field, reverse };
    this.submissions = this.submissions.sort(this.compare(field, reverse));
  }
}