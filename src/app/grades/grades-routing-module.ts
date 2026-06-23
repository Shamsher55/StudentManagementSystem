import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GradesLayout } from './grades-layout/grades-layout';
import { GradeList } from './grade-list/grade-list';
import { GradeForm } from './grade-form/grade-form';

const routes: Routes = [
  {
    path: '',
    component: GradesLayout,
    children: [
      { path: '',        component: GradeList },
      { path: 'add',     component: GradeForm },
      { path: 'edit/:id',component: GradeForm },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GradesRoutingModule {}
