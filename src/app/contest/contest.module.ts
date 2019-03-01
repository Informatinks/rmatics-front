import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';

import { ControlsModule } from '../controls/controls.module';
import { SharedModule } from '../shared/shared.module';

import { ContestMenuComponent } from './contest-menu/contest-menu.component';
import { TaskItemComponent } from './contest-menu/task-item/task-item.component';
import { CodeBlockComponent } from './contest-task/code-block/code-block.component';
import { ContestTaskComponent } from './contest-task/contest-task.component';
import { IconLabelComponent } from './contest-task/icon-label/icon-label.component';
import { PaginationComponent } from './contest-task/pagination/pagination.component';
import { ContestComponent } from './contest.component';
import { PackageStatusComponent } from './sent-packages/package-status/package-status.component';
import { SentPackagesComponent } from './sent-packages/sent-packages.component';
import { TaskSolutionComponent } from './task-solution/task-solution.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'task/1',
    pathMatch: 'full',
  },
  {
    path: 'task/:id',
    component: ContestComponent,
  },
];

@NgModule({
  declarations: [
    ContestComponent,
    ContestTaskComponent,
    ContestMenuComponent,
    TaskSolutionComponent,
    SentPackagesComponent,
    TaskItemComponent,
    CodeBlockComponent,
    IconLabelComponent,
    PaginationComponent,
    PackageStatusComponent,
  ],
  imports: [
    CodemirrorModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ControlsModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    ContestComponent,
    ContestTaskComponent,
    ContestMenuComponent,
    TaskSolutionComponent,
    SentPackagesComponent,
  ],
})

export class ContestModule {
}
