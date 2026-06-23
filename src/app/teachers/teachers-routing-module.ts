import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeachersLayout } from './teachers-layout/teachers-layout';
import { TeacherList } from './teacher-list/teacher-list';
import { TeacherForm } from './teacher-form/teacher-form';

const routes: Routes = [{
  path: '', component: TeachersLayout,
  children: [
    { path: '',        component: TeacherList },
    { path: 'add',     component: TeacherForm },
    { path: 'edit/:id',component: TeacherForm },
  ],
}];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class TeachersRoutingModule {}
