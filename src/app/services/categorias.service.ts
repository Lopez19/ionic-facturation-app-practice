import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { CapacitorHttp, HttpOptions, HttpResponse } from '@capacitor/core';

// Interfaces
import { ICategoria } from '../interfaces/categoria.interface';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class CategoriasService {
  private _categorias = new BehaviorSubject<ICategoria[]>([]);
  categorias$ = this._categorias.asObservable();

  // Constructor
  constructor(private appStorageService: StorageService) {
    (async () => {
      await this.getCategorias();
    })();
  }

  // Metodos
  categoriasCount$: Observable<number> = this.categorias$.pipe(
    map((categorias) => categorias.length)
  );

  async getCategorias() {
    try {
      const token = await this.appStorageService.get('token');
      let options: HttpOptions = {
        method: 'GET',
        url: 'http://localhost:3000/categorias',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response: HttpResponse = await CapacitorHttp.get(options);

      // Ordenar por nombre TODO: Hacer este orden en el backend
      response.data.sort((a: ICategoria, b: ICategoria) => {
        if (a.nombre < b.nombre) {
          return -1;
        }
        if (a.nombre > b.nombre) {
          return 1;
        }
        return 0;
      });

      this._categorias.next(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  async getCategoriaById(id: string, tk: string) {
    try {
      let options: HttpOptions = {
        method: 'GET',
        url: `http://localhost:3000/categorias/${id}`,
        headers: {
          Authorization: `Bearer ${tk}`,
        },
      };

      const response: HttpResponse = await CapacitorHttp.get(options);

      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async createCategoria(categoria: ICategoria, tk: string) {
    try {
      let options: HttpOptions = {
        method: 'POST',
        url: 'http://localhost:3000/categorias',
        data: categoria,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tk}`,
        },
      };

      const response: HttpResponse = await CapacitorHttp.post(options);

      await this.getCategorias();

      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async updateCategoria(categoria: ICategoria, tk: string) {
    try {
      let options: HttpOptions = {
        method: 'PUT',
        url: `http://localhost:3000/categorias/${categoria.idcategoria}`,
        data: categoria,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tk}`,
        },
      };

      const response: HttpResponse = await CapacitorHttp.put(options);

      await this.getCategorias();

      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteCategoria(id: number, tk: string) {
    try {
      let options: HttpOptions = {
        method: 'DELETE',
        url: `http://localhost:3000/categorias/${id}`,
        headers: {
          Authorization: `Bearer ${tk}`,
        },
      };

      const response: HttpResponse = await CapacitorHttp.delete(options);

      await this.getCategorias();

      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
}
