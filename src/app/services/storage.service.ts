import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _storage: Storage | null = null;
  private _isInit$ = new Subject<boolean>();
  isInit$ = this._isInit$.asObservable();

  constructor(private storage: Storage) {
    (async () => {
      await this.init();
    })();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
    this._isInit$.next(true);

    console.log('Storage ready!');
  }

  public async set(key: string, value: any) {
    try {
      let result = await this._storage?.set(key, value);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

  public async get(key: string) {
    try {
      let result = await this._storage?.get(key);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  public async getObject(key: string) {
    try {
      let result = await this._storage?.get(key);
      return JSON.parse(result);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  public async remove(key: string) {
    try {
      let result = await this._storage?.remove(key);
      console.log('remove', key, result);
    } catch (error) {
      console.log(error);
    }
  }

  public async clear() {
    try {
      let result = await this._storage?.clear();
      console.log('clear', result);
    } catch (error) {
      console.log(error);
    }
  }

  public async keys() {
    try {
      let result = await this._storage?.keys();
      console.log('keys', result);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  public async length() {
    try {
      let result = await this._storage?.length();
      console.log('length', result);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  public async forEach() {
    try {
      let result = await this._storage?.forEach((value, key, index) => {
        console.log('Found', value, 'at', key);
      });
      console.log('forEach', result);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
