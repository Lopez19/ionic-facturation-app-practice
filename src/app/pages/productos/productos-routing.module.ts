import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditComponent } from './pages/edit/edit.component';
import { NuevoComponent } from './pages/nuevo/nuevo.component';
import { PrincipalComponent } from './pages/principal/principal.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'nuevo',
        component: NuevoComponent,
      },
      {
        path: 'edit/:id',
        component: EditComponent,
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
export class ProductosRoutingModule {}
