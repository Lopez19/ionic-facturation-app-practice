import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Routing
import { StockRoutingModule } from './stock-routing.module';

// Components
import { EditItemComponent } from './pages/edit-item/edit-item.component';
import { NuevoItemComponent } from './pages/nuevo-item/nuevo-item.component';
import { PrincipalComponent } from './pages/principal/principal.component';

@NgModule({
  declarations: [EditItemComponent, NuevoItemComponent, PrincipalComponent],
  imports: [CommonModule, StockRoutingModule],
})
export class StockModule {}
