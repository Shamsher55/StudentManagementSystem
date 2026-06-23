import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceLayout } from './attendance-layout/attendance-layout';
import { AttendanceList } from './attendance-list/attendance-list';
import { AttendanceMark } from './attendance-mark/attendance-mark';

const routes: Routes = [
  {
    path: '',
    component: AttendanceLayout,
    children: [
      { path: '',     component: AttendanceList },
      { path: 'mark', component: AttendanceMark },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AttendanceRoutingModule {}
