import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayout } from './dashboard-layout/dashboard-layout';
import { Dashboard } from './dashboard/dashboard';

const routes: Routes = [
  {
    path: '',
    component: DashboardLayout,
    children: [
      { path: '', component: Dashboard },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
