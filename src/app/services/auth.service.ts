import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _loggedIn = new BehaviorSubject<boolean>(false);
  loggedIn$ = this._loggedIn.asObservable();

  constructor(
    private appStorageService: StorageService,
    private router: Router
  ) {
    (async () => {
      await this.voToken();
    })();
  }

  async login(username: string, password: string) {
    const options = {
      url: 'http://localhost:3000/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        username,
        password,
      },
    };

    const response: HttpResponse = await CapacitorHttp.post(options);

    if (response.status === 200) {
      this._loggedIn.next(true);
    }

    return response;
  }

  public async voToken() {
    try {
      this.appStorageService.isInit$.subscribe((isInit) => {
        if (isInit) {
          (async () => {
            const token = await this.appStorageService.get('token');

            if (token) {
              this._loggedIn.next(true);
              console.log('con token');
              await this.router.navigate(['/home']);
            } else {
              this._loggedIn.next(false);
              console.log('no token');

              await this.router.navigate(['/login']);
            }
          })();
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  public async logout() {
    await this.appStorageService.remove('token');
    await this.appStorageService.remove('user');
    await this.appStorageService.remove('mensaje');

    this._loggedIn.next(false);
    await this.router.navigateByUrl('/login');
  }
}
