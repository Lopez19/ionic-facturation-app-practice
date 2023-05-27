import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

// Routing
import { UsuariosRoutingModule } from './usuarios-routing.module';

// Components
import { PrincipalComponent } from './pages/principal/principal.component';
import { EditComponent } from './pages/edit/edit.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { VerComponent } from './pages/ver/ver.component';

@NgModule({
  declarations: [
    PrincipalComponent,
    RegistroComponent,
    EditComponent,
    VerComponent,
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    IonicModule,
    ReactiveFormsModule,
  ],
})
export class UsuariosModule {}
