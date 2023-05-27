import { Injectable } from '@angular/core';
import { Rol } from '../interfaces/rol.interface';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';
import { CapacitorHttp } from '@capacitor/core';
import { Router } from '@angular/router';
import { Usuario } from '../interfaces/usuario.interface';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private _roles$ = new BehaviorSubject<Rol[]>([]);
  public roles$ = this._roles$.asObservable();

  constructor(
    private appStorageService: StorageService,
    private router: Router
  ) {
    (async () => {
      await this.getRoles();
    })();
  }

  // Private methods
  private setRoles(roles: Rol[]) {
    this._roles$.next(roles);
  }

  // Methods
  public async getRoles() {
    const token = await this.appStorageService.get('token');

    let options = {
      method: 'GET',
      url: 'http://localhost:3000/rols',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await CapacitorHttp.get(options);

    const roles = response.data;
    this.setRoles(roles);
  }
}
