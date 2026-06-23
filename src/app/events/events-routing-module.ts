import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventsLayout } from './events-layout/events-layout';
import { EventsCalendar } from './events-calendar/events-calendar';
import { EventForm } from './event-form/event-form';

const routes: Routes = [{
  path: '', component: EventsLayout,
  children: [
    { path: '',        component: EventsCalendar },
    { path: 'add',     component: EventForm },
    { path: 'edit/:id',component: EventForm },
  ],
}];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class EventsRoutingModule {}
