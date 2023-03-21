import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FacDetailPage } from './fac-detail.page';

const routes: Routes = [
  {
    path: '',
    component: FacDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FacDetailPageRoutingModule {}
