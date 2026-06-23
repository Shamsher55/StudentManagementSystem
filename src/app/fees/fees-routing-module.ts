import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeesLayout } from './fees-layout/fees-layout';
import { FeeList } from './fee-list/fee-list';
import { FeeForm } from './fee-form/fee-form';

const routes: Routes = [{
  path: '', component: FeesLayout,
  children: [
    { path: '',        component: FeeList },
    { path: 'add',     component: FeeForm },
    { path: 'edit/:id',component: FeeForm },
  ],
}];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class FeesRoutingModule {}
