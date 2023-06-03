import { Injectable } from '@angular/core';
import { IProducto } from '../interfaces/producto.interface';
import { BehaviorSubject } from 'rxjs';
import { CapacitorHttp } from '@capacitor/core';
import { StorageService } from './storage.service';
import { CategoriasService } from './categorias.service';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  constructor(
    private _appStorageService: StorageService,
    private categoriasService: CategoriasService
  ) {
    (async () => {
      await this.getProductos();
    })();
  }

  private _productos$ = new BehaviorSubject<IProducto[]>([]);
  public productos$ = this._productos$.asObservable();
  categorias$ = this.categoriasService.categorias$;

  public setProductos(productos: IProducto[]) {
    this._productos$.next(productos);
  }

  // Methods
  public async getProductos(): Promise<void> {
    const tk = await this._appStorageService.get('token');

    let options = {
      method: 'GET',
      url: 'http://localhost:3000/productos',
      headers: {
        Authorization: `Bearer ${tk}`,
      },
    };

    const { data } = await CapacitorHttp.get(options);

    const productos = data;

    productos.forEach((producto: IProducto) => {
      this.categorias$.subscribe((categorias) => {
        const categoria = categorias.find(
          (categoria) => categoria.idcategoria === producto.categoriaId
        )?.nombre;

        producto.categoriaId = categoria ?? 'Sin categoria';
      });
    });

    this.setProductos(productos);
  }

  public async deleteProducto(producto: IProducto): Promise<number> {
    const tk = await this._appStorageService.get('token');

    let options = {
      method: 'DELETE',
      url: `http://localhost:3000/productos/${producto.idproducto}`,
      headers: {
        Authorization: `Bearer ${tk}`,
      },
    };

    const { status } = await CapacitorHttp.delete(options);

    await this.getProductos();

    return status;
  }

  public async createProducto(producto: IProducto): Promise<number> {
    const tk = await this._appStorageService.get('token');

    let options = {
      method: 'POST',
      url: 'http://localhost:3000/productos',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tk}`,
      },
      data: producto,
    };

    const { status } = await CapacitorHttp.post(options);
    await this.getProductos();

    return status;
  }

  public async updateProducto(
    producto: IProducto,
    id: number
  ): Promise<number> {
    const tk = await this._appStorageService.get('token');

    let options = {
      method: 'PUT',
      url: `http://localhost:3000/productos/${id}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tk}`,
      },
      data: producto,
    };

    const { status } = await CapacitorHttp.put(options);
    await this.getProductos();

    return status;
  }

  public async getProductoById(id: number): Promise<IProducto> {
    const tk = await this._appStorageService.get('token');

    let options = {
      method: 'GET',
      url: `http://localhost:3000/productos/${id}`,
      headers: {
        Authorization: `Bearer ${tk}`,
      },
    };

    const { data } = await CapacitorHttp.get(options);

    return data;
  }
}
