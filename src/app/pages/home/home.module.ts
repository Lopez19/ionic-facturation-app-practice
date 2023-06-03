import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { VerFacturaComponent } from './pages/ver-factura/ver-factura.component';
import { NuevaFacturaComponent } from './pages/nueva-factura/nueva-factura.component';
import { AddItemComponent } from './pages/add-item/add-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [
    HomePage,
    VerFacturaComponent,
    NuevaFacturaComponent,
    AddItemComponent,
  ],
})
export class HomePageModule {}
