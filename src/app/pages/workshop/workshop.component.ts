import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

import {ContestService} from '../contest/contest.service';

import { WorkshopService } from './workshop.service';

@Component({
  selector: 'app-workshop',
  templateUrl: './workshop.component.html',
  styleUrls: ['./workshop.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkshopComponent implements OnInit {
  workshop = this.workshopService.workshop;
  isFetching = this.workshopService.isFetching;
  contest = this.contestService.contest;

  constructor(
    private workshopService: WorkshopService,
    private router: Router,
    private contestService: ContestService,
  ) { }

  ngOnInit() {
    this.workshopService.getWorkshop(1);
    this.workshopService.workshop.subscribe(data => console.log(data));
  }

  onContestClicked(contestId: number, duration: number) {
    this.workshopService.setFetching(true);
    this.router.navigate(['contest', {id: contestId, duration}]);
  }
}
