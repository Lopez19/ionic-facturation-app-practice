import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Routing
import { ProductosRoutingModule } from './productos-routing.module';

// Components
import { EditComponent } from './pages/edit/edit.component';
import { NuevoComponent } from './pages/nuevo/nuevo.component';
import { PrincipalComponent } from './pages/principal/principal.component';

@NgModule({
  declarations: [EditComponent, NuevoComponent, PrincipalComponent],
  imports: [CommonModule, ProductosRoutingModule],
})
export class ProductosModule {}
