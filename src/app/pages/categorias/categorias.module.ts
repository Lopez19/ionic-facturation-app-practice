import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

// Routing
import { CategoriasRoutingModule } from './categorias-routing.module';

// Components
import { NuevaComponent } from './pages/nueva/nueva.component';
import { EditarComponent } from './pages/editar/editar.component';
import { PrincipalComponent } from './pages/principal/principal.component';

@NgModule({
  declarations: [NuevaComponent, EditarComponent, PrincipalComponent],
  imports: [
    CommonModule,
    CategoriasRoutingModule,
    IonicModule,
    ReactiveFormsModule,
  ],
})
export class CategoriasModule {}
