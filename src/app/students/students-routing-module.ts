import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentsLayout } from './students-layout/students-layout';
import { StudentList } from './student-list/student-list';
import { StudentForm } from './student-form/student-form';

const routes: Routes = [
  {
    path: '',
    component: StudentsLayout,
    children: [
      { path: '',         component: StudentList },
      { path: 'add',      component: StudentForm },
      { path: 'edit/:id', component: StudentForm },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentsRoutingModule {}
