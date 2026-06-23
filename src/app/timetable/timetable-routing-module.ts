import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TimetableLayout } from './timetable-layout/timetable-layout';
import { TimetableView } from './timetable-view/timetable-view';
import { TimetableForm } from './timetable-form/timetable-form';

const routes: Routes = [{
  path: '', component: TimetableLayout,
  children: [
    { path: '',        component: TimetableView },
    { path: 'add',     component: TimetableForm },
    { path: 'edit/:id',component: TimetableForm },
  ],
}];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class TimetableRoutingModule {}
