import { Component, OnInit } from '@angular/core';
import { FacturaService } from 'src/app/services/factura.service';
import { factura } from '../../interfaces/factura.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  facturas: factura[] = [];

  constructor(private facturaService: FacturaService, private router: Router) {}

  OnInit() {
    this.facturas = this.facturaService.getFacturas();
  }

  ionViewWillEnter() {
    this.facturas = this.facturaService.getFacturas();
  }

  addNewFactura() {
    // this.facturas.unshift({
    //   id: 4,
    //   fecha: '2020-01-04',
    //   cliente: 'Cliente 4',
    //   imageUrl: 'https://picsum.photos/200/300',
    //   description: [
    //     {
    //       id: 41,
    //       descripcion: 'Producto 41',
    //       cantidad: 1,
    //       precio: 7000,
    //     },
    //     {
    //       id: 42,
    //       descripcion: 'Producto 42',
    //       cantidad: 2,
    //       precio: 2000,
    //     },
    //   ],
    //   estado: 'Pendiente',
    //   observaciones: 'Observaciones 4',
    //   total: 9000,
    // });

    console.log('addNewFactura');
  }

  logout() {
    this.router.navigate(['/login']);
  }
}
