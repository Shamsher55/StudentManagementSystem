import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoursesLayout } from './courses-layout/courses-layout';
import { CourseList } from './course-list/course-list';
import { CourseForm } from './course-form/course-form';

const routes: Routes = [
  {
    path: '',
    component: CoursesLayout,
    children: [
      { path: '',         component: CourseList },
      { path: 'add',      component: CourseForm },
      { path: 'edit/:id', component: CourseForm },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoursesRoutingModule {}
