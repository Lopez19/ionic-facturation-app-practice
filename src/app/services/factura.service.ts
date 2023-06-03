import { Injectable } from '@angular/core';
import { IFactura, IEstado } from '../interfaces/factura.interface';
import { BehaviorSubject } from 'rxjs';
import { StockService } from './stock.service';
import { CapacitorHttp } from '@capacitor/core';
import { StorageService } from './storage.service';
import { Usuario } from '../interfaces/usuario.interface';

@Injectable({
  providedIn: 'root',
})
export class FacturaService {
  private _facturas$ = new BehaviorSubject<IFactura[]>([]);
  private _status$ = new BehaviorSubject<IEstado[]>([]);
  private _admin$ = new BehaviorSubject<boolean>(false);

  public facturas$ = this._facturas$.asObservable();
  public status$ = this._status$.asObservable();
  public admin$ = this._admin$.asObservable();

  constructor(
    private _stockService: StockService,
    private _appStorageService: StorageService
  ) {
    (async () => {
      await this.getStatus();
    })();
  }

  public stock$ = this._stockService.stock$;

  private setFacturas(facturas: IFactura[]) {
    this._facturas$.next(facturas);
  }

  private setStatus(status: any[]) {
    this._status$.next(status);
  }

  async getFacturas(): Promise<void> {
    const tk = await this._appStorageService.get('token');

    let options = {
      method: 'GET',
      url: 'http://localhost:3000/facturas',
      headers: {
        Authorization: `Bearer ${tk}`,
      },
    };

    const { data } = await CapacitorHttp.get(options);

    data.forEach(async (factura: IFactura) => {
      const estado = this._status$.value.find(
        (estado) => estado.idEstado === factura.estadoId
      );
      factura.estado = estado?.nombre;

      factura.detalle.forEach((detalle) => {
        this.stock$.subscribe((productos) => {
          const producto = productos.find(
            (stockProduct) => stockProduct.iditem === detalle.NmbItem
          );
          detalle.nombre = producto?.nombre;
        });
      });
    });

    if (await this._isAdmin()) {
      console.log(`Admin: ${await this._isAdmin()}`);
      this.setFacturas(data);
    } else {
      console.log(`Admin: ${await this._isAdmin()}`);

      let facturasUser: IFactura[] = [];

      const user: Usuario = await this._appStorageService.getObject('user');
      data.forEach((factura: IFactura) => {
        if (Number(factura.encabezado.Receptor.RUTRecep) === user.DNI) {
          facturasUser.push(factura);
        }
      });

      this.setFacturas(facturasUser);
    }
  }

  async getStatus(): Promise<void> {
    const tk = await this._appStorageService.get('token');

    let options = {
      method: 'GET',
      url: 'http://localhost:3000/estados',
      headers: {
        Authorization: `Bearer ${tk}`,
      },
    };

    const { data } = await CapacitorHttp.get(options);
    this.setStatus(data);
  }

  async createFactura(factura: IFactura): Promise<number> {
    const tk = await this._appStorageService.get('token');

    let options = {
      method: 'POST',
      url: 'http://localhost:3000/facturas',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tk}`,
      },
      data: factura,
    };

    const { status } = await CapacitorHttp.post(options);

    if (status === 200) {
      await this.getFacturas();
    }

    return status;
  }

  async deleteFactura(id: string): Promise<number> {
    const tk = await this._appStorageService.get('token');

    let options = {
      method: 'DELETE',
      url: `http://localhost:3000/facturas/${id}`,
      headers: {
        Authorization: `Bearer ${tk}`,
      },
    };

    const { status } = await CapacitorHttp.delete(options);

    if (status === 204) {
      await this.getFacturas();
    }

    return status;
  }

  async updateFactura(factura: IFactura): Promise<number> {
    const tk = await this._appStorageService.get('token');

    delete factura.estado;

    let options = {
      method: 'PUT',
      url: `http://localhost:3000/facturas/${factura.idFactura}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tk}`,
      },
      data: factura,
    };

    const { status } = await CapacitorHttp.put(options);

    if (status === 204) {
      await this.getFacturas();
    }

    return status;
  }

  // Private methods
  private async _isAdmin() {
    const user: Usuario = await this._appStorageService.getObject('user');
    if (user.rolId === 'Administrador') {
      this._admin$.next(true);
      return true;
    } else {
      this._admin$.next(false);
      return false;
    }
  }
}
