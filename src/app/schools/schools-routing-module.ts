import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchoolsLayout } from './schools-layout/schools-layout';
import { SchoolList } from './school-list/school-list';
import { SchoolForm } from './school-form/school-form';

const routes: Routes = [{
  path: '', component: SchoolsLayout,
  children: [
    { path: '',        component: SchoolList },
    { path: 'add',     component: SchoolForm },
    { path: 'edit/:id',component: SchoolForm },
  ],
}];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class SchoolsRoutingModule {}
