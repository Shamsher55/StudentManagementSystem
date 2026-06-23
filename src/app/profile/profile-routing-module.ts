import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileLayout } from './profile-layout/profile-layout';
import { ProfilePage } from './profile-page/profile-page';

const routes: Routes = [
  { path: '', component: ProfileLayout, children: [{ path: '', component: ProfilePage }] },
];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class ProfileRoutingModule {}
