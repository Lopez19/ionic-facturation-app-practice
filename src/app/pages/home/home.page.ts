import { Component } from '@angular/core';
import { FacturaService } from 'src/app/services/factura.service';
import { factura } from '../../interfaces/factura.interface';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { Usuario } from '../../interfaces/usuario.interface';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  facturas: factura[] = [];
  user: Usuario = {} as Usuario;

  constructor(
    private facturaService: FacturaService,
    private router: Router,
    private appStorageService: StorageService,
    private authService: AuthService
  ) {}

  async ionViewWillEnter() {
    this.user = await this.appStorageService.getObject('user');
    if (this.isAdmin()) {
      this.facturas = this.facturaService.getFacturas();
    } else {
      this.getFacturasByUser();
    }
  }

  async addNewFactura() {
    console.log('addNewFactura');
  }

  logout() {
    this.authService.logout();
  }

  getFacturasByUser() {
    this.facturas = this.facturaService.getFacturasByClient(this.user.DNI);
  }

  isAdmin() {
    return this.user.rolId === 'Administrador';
  }
}
