import { Injectable } from '@angular/core';
import { CapacitorHttp } from '@capacitor/core';
import { ProductosService } from './productos.service';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';
import { IStock } from '../interfaces/stock.interface';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  private _stock$ = new BehaviorSubject<IStock[]>([]);
  public stock$ = this._stock$.asObservable();

  constructor(
    private productosService: ProductosService,
    private appStorageService: StorageService
  ) {
    (async () => {
      await this.getStock();
    })();
  }

  productos$ = this.productosService.productos$;

  async getStock() {
    const tk = await this.appStorageService.get('token');

    let options = {
      url: 'http://localhost:3000/items',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tk}`,
      },
    };

    const response = await CapacitorHttp.get(options);

    this.productos$.subscribe((productos) => {
      productos.forEach((producto) => {
        response.data.forEach((item: IStock) => {
          if (item.productoId === producto.idproducto) {
            item.nombre = producto.nombre;
            item.precio = producto.precio;
            item.des = producto.detalle;
          }
        });
      });
    });

    this._stock$.next(response.data);
  }

  async addStock(item: IStock) {
    const tk = await this.appStorageService.get('token');

    let options = {
      url: 'http://localhost:3000/items',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tk}`,
      },
      data: item,
    };

    await CapacitorHttp.post(options);

    await this.getStock();
  }

  async deleteStock(item: number) {
    const tk = await this.appStorageService.get('token');

    let options = {
      url: `http://localhost:3000/items/${item}`,
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${tk}`,
      },
    };

    const res = await CapacitorHttp.delete(options);
    await this.getStock();

    return res;
  }

  async getStockById(id: number) {
    const tk = await this.appStorageService.get('token');

    let options = {
      url: `http://localhost:3000/items/${id}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tk}`,
      },
    };

    const res = await CapacitorHttp.get(options);

    return res;
  }

  async updateStock(item: IStock) {
    const tk = await this.appStorageService.get('token');

    let options = {
      url: `http://localhost:3000/items/${item.iditem}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tk}`,
      },
      data: item,
    };

    await CapacitorHttp.put(options);

    await this.getStock();
  }
}
