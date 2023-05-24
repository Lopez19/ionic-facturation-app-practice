import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NuevoItemComponent } from './pages/nuevo-item/nuevo-item.component';
import { EditItemComponent } from './pages/edit-item/edit-item.component';
import { PrincipalComponent } from './pages/principal/principal.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'nuevo-stock',
        component: NuevoItemComponent,
      },
      {
        path: 'edit-stock/:id',
        component: EditItemComponent,
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
export class StockRoutingModule {}
