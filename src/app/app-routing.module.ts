import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContestGuardService } from './pages/contest/contest-guard.service';

const routes: Routes = [
  {
    path: 'demo',
    loadChildren: './pages/demo/demo.module#DemoModule',
  },
  {
    path: 'contest',
    loadChildren: './pages/contest/contest.module#ContestModule',
    canActivate: [ContestGuardService],
  },
  {
    path: 'workshop',
    loadChildren: './pages/workshop/workshop.module#WorkshopModule',
    canActivate: [ContestGuardService],
  },
  {
    path: 'auth',
    loadChildren: './pages/auth/auth.module#AuthModule',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
