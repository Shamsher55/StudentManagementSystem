import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersLayout } from './users-layout/users-layout';

const routes: Routes = [
  { path: '', component: UsersLayout }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRouting {}
