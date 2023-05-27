import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CapacitorHttp } from '@capacitor/core';
import { StorageService } from './storage.service';
import { Usuario } from '../interfaces/usuario.interface';
import { RolesService } from './roles.service';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  // Constructor
  constructor(
    private appStorageService: StorageService,
    private rolesServices: RolesService
  ) {
    (async () => {
      await this.getUsuarios();
    })();
  }

  // Properties
  private _usuarios = new BehaviorSubject<Usuario[]>([]);
  public usuarios$ = this._usuarios.asObservable();
  roles$ = this.rolesServices.roles$;

  // Private methods
  private setUsuarios(usuarios: Usuario[]) {
    this._usuarios.next(usuarios);
  }

  // Methods
  public async getUsuarios() {
    const token = await this.appStorageService.get('token');

    let options = {
      method: 'GET',
      url: 'http://localhost:3000/usuarios',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await CapacitorHttp.get(options);
    const usuarios = response.data;

    // Add roles to usuarios
    usuarios.forEach((usuario: Usuario) => {
      this.roles$.subscribe((roles) => {
        const rol = roles.find((rol) => rol.idRol === usuario.rolId)?.nombre;
        usuario.rolId = rol ?? 'Sin rol';
      });
    });

    // Ordenar usuarios por id TODO: Move this to backend
    usuarios.sort((a: Usuario, b: Usuario) => {
      if (String(a.idUsuario) > String(b.idUsuario)) {
        return 1;
      }

      if (String(a.nombre) < String(b.nombre)) {
        return -1;
      }

      return 0;
    });

    this.setUsuarios(usuarios);
  }

  public async addUsuario(user: Usuario) {
    const token = await this.appStorageService.get('token');

    let options = {
      method: 'POST',
      url: 'http://localhost:3000/usuarios',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: user,
    };

    const response = await CapacitorHttp.post(options);
    const usuario = response.data;

    await this.getUsuarios();

    return usuario;
  }

  public async deleteUsuario(user: Usuario) {
    const token = await this.appStorageService.get('token');

    let options = {
      method: 'DELETE',
      url: `http://localhost:3000/usuarios/${user.idUsuario}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await CapacitorHttp.delete(options);
    const usuario = response.data;

    await this.getUsuarios();

    return usuario;
  }

  public async getUsuarioById(id: string) {
    const token = await this.appStorageService.get('token');

    let options = {
      method: 'GET',
      url: `http://localhost:3000/usuarios/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await CapacitorHttp.get(options);
    const usuario = response.data;

    return usuario;
  }

  public async updateUsuario(user: Usuario, id: string) {
    const token = await this.appStorageService.get('token');

    let options = {
      method: 'PUT',
      url: `http://localhost:3000/usuarios/${id}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: user,
    };

    const response = await CapacitorHttp.put(options);
    const usuario = response.status;

    await this.getUsuarios();

    return usuario;
  }
}
