import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdmissionsLayout } from './admissions-layout/admissions-layout';
import { AdmissionList } from './admission-list/admission-list';
import { AdmissionForm } from './admission-form/admission-form';
import { AdmissionDetail } from './admission-detail/admission-detail';

const routes: Routes = [
  {
    path: '',
    component: AdmissionsLayout,
    children: [
      { path: '',         component: AdmissionList },
      { path: 'add',      component: AdmissionForm },
      { path: 'edit/:id', component: AdmissionForm },
      { path: 'view/:id', component: AdmissionDetail },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdmissionsRoutingModule {}
