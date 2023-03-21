import { Injectable } from '@angular/core';
import { factura } from '../interfaces/factura.interface';

@Injectable({
  providedIn: 'root',
})
export class FacturaService {
  private _facturas: factura[] = [
    {
      id: 1,
      fecha: '2020-01-01',
      cliente: 'Cliente 1',
      imageUrl: 'https://picsum.photos/200/300',
      description: [
        {
          id: 1,
          descripcion: 'Producto 1',
          cantidad: 1,
          precio: 9000,
        },
        {
          id: 2,
          descripcion: 'Producto 2',
          cantidad: 2,
          precio: 2000,
        },
      ],
      estado: 'Pendiente',
      observaciones: 'Observaciones 1',
      total: 11000,
    },
    {
      id: 2,
      fecha: '2020-01-02',
      cliente: 'Cliente 2',
      imageUrl: 'https://picsum.photos/200/300',
      description: [
        {
          id: 1,
          descripcion: 'Producto 1',
          cantidad: 1,
          precio: 4000,
        },
        {
          id: 2,
          descripcion: 'Producto 2',
          cantidad: 2,
          precio: 2000,
        },
      ],
      estado: 'Pendiente',
      observaciones: 'Observaciones 2',
      total: 6000,
    },
    {
      id: 3,
      fecha: '2020-01-03',
      cliente: 'Cliente 3',
      imageUrl: 'https://picsum.photos/200/300',
      description: [
        {
          id: 1,
          descripcion: 'Producto 1',
          cantidad: 1,
          precio: 1000,
        },
        {
          id: 2,
          descripcion: 'Producto 2',
          cantidad: 2,
          precio: 2000,
        },
      ],
      estado: 'Pagado',
      observaciones: 'Observaciones 3',
      total: 3000,
    },
  ];

  constructor() {}

  getFacturas() {
    return [...this._facturas];
  }

  getFacturaById(idFactura: string) {
    return {
      ...this._facturas.find((factura) => {
        return factura.id === +idFactura;
      }),
    };
  }

  addNewFactura(factura: factura) {
    this._facturas.push({
      ...factura,
      id: this._facturas.length + 1,
      description: [],
      fecha: new Date().toISOString(),
    });
  }

  updateFactura() {}

  deleteFactura(idFactura: string) {
    this._facturas = this._facturas.filter((factura) => {
      return factura.id !== +idFactura;
    });
  }

  // getFacturasByDate() {}

  // getFacturasByClient() {}

  // getFacturasByTotal() {}
}
