import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExamsLayout } from './exams-layout/exams-layout';
import { ExamList } from './exam-list/exam-list';
import { ExamForm } from './exam-form/exam-form';

const routes: Routes = [{
  path: '', component: ExamsLayout,
  children: [
    { path: '',        component: ExamList },
    { path: 'add',     component: ExamForm },
    { path: 'edit/:id',component: ExamForm },
  ],
}];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class ExamsRoutingModule {}
