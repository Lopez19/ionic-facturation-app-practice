import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NuevaComponent } from './pages/nueva/nueva.component';
import { EditarComponent } from './pages/editar/editar.component';
import { PrincipalComponent } from './pages/principal/principal.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'nueva',
        component: NuevaComponent,
      },
      {
        path: 'edit/:id',
        component: EditarComponent,
      },
      {
        path: 'viewAll',
        component: PrincipalComponent,
      },
      {
        path: '**',
        redirectTo: 'viewAll',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoriasRoutingModule {}
