import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FacDetailPageRoutingModule } from './fac-detail-routing.module';

import { FacDetailPage } from './fac-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FacDetailPageRoutingModule
  ],
  declarations: [FacDetailPage]
})
export class FacDetailPageModule {}
