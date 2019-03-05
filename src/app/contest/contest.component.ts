import { map } from 'rxjs/operators';

import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from '../api/auth.service';

import { ContestService } from './contest.service';
import { ContestProblem } from './contest.types';
import { SubmissionService } from './submission.service';

const defaultContestId = 1;

@Component({
  selector: 'app-contest',
  templateUrl: './contest.component.html',
  styleUrls: ['./contest.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ContestComponent implements OnInit, OnDestroy {
  problem = this.contestService.problem;
  contest = this.contestService.contest;
  submissions = this.contestService.submissions;
  isFetching = this.contestService.isFetching;
  isSubmissionsFetching = this.contestService.isSubmissionsFetching;
  paginationItems = this.contestService.contest
    .pipe(map(contest => {
      if (contest !== undefined) {
        const currentIndex = contest.problems.findIndex((item: ContestProblem) => item.id === this.currentTaskId);
        return [contest.problems[currentIndex - 1], contest.problems[currentIndex + 1]];
      }

      return [undefined, undefined];
    }));

  currentTaskId = 1;
  routeChangeSubscription = this.route.url.subscribe(segments => {
    const taskNumber = Number(segments[segments.length - 1].path);
    if (!isNaN(taskNumber)) {
      this.contestService.getProblem(taskNumber);
      this.contestService.getSubmissions(taskNumber);
      this.contestService.getProblem(taskNumber);
      this.currentTaskId = taskNumber;
    }
  });

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private contestService: ContestService,
    private submissionService: SubmissionService,
  ) {
  }

  addSubmission(data: { code: string, languageId: number }) {
    this.contestService.addSubmission(this.currentTaskId, data.code, data.languageId);
  }

  openSubmission(id: number) {
    this.contestService.getSubmissions(this.currentTaskId);
    this.submissionService.showSubmission(id);
  }

  getSubmissions() {
    this.contestService.getSubmissions(this.currentTaskId);
  }

  logout() {
    this.auth.logout();
  }

  ngOnInit() {
    this.contestService.getContest(defaultContestId);
  }

  ngOnDestroy() {
    this.routeChangeSubscription.unsubscribe();
  }
}
