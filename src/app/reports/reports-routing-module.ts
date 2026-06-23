import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsLayout } from './reports-layout/reports-layout';
import { ReportsDashboard } from './reports-dashboard/reports-dashboard';
import { StudentProgress } from './student-progress/student-progress';

const routes: Routes = [
  {
    path: '',
    component: ReportsLayout,
    children: [
      { path: '', component: ReportsDashboard },
      { path: 'student-progress', component: StudentProgress },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
