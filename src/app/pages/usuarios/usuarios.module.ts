import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Routing
import { UsuariosRoutingModule } from './usuarios-routing.module';

// Components
import { PrincipalComponent } from './pages/principal/principal.component';
import { EditComponent } from './pages/edit/edit.component';
import { RegistroComponent } from './pages/registro/registro.component';

@NgModule({
  declarations: [PrincipalComponent, RegistroComponent, EditComponent],
  imports: [CommonModule, UsuariosRoutingModule],
})
export class UsuariosModule {}
