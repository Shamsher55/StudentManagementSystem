import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentPortalLayout } from './student-portal-layout/student-portal-layout';
import { StudentHome } from './student-home/student-home';

const routes: Routes = [
  {
    path: '',
    component: StudentPortalLayout,
    children: [
      { path: '', component: StudentHome },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentPortalRoutingModule {}
