import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { canMatchGuardFn } from './guards/indexGuardFn';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: async () =>
      (await import('./pages/login/login.module')).LoginPageModule,
  },
  {
    path: 'home',
    loadChildren: async () =>
      (await import('./pages/home/home.module')).HomePageModule,
    canLoad: [canMatchGuardFn],
  },
  {
    path: 'usuarios',
    loadChildren: async () =>
      (await import('./pages/usuarios/usuarios.module')).UsuariosModule,
    canLoad: [canMatchGuardFn],
  },
  {
    path: 'categorias',
    loadChildren: async () =>
      (await import('./pages/categorias/categorias.module')).CategoriasModule,
    canLoad: [canMatchGuardFn],
  },
  {
    path: 'productos',
    loadChildren: async () =>
      (await import('./pages/productos/productos.module')).ProductosModule,
    canLoad: [canMatchGuardFn],
  },
  {
    path: 'stock',
    loadChildren: async () =>
      (await import('./pages/stock/stock.module')).StockModule,
    canLoad: [canMatchGuardFn],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
