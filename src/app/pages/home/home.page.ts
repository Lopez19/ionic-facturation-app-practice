import { Component, OnInit } from '@angular/core';
import { FacturaService } from 'src/app/services/factura.service';
import { StorageService } from 'src/app/services/storage.service';
import { Usuario } from '../../interfaces/usuario.interface';
import { AuthService } from 'src/app/services/auth.service';
import { IFactura } from '../../interfaces/factura.interface';
import {
  ActionSheetController,
  AlertController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { VerFacturaComponent } from './pages/ver-factura/ver-factura.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  user: Usuario = {} as Usuario;
  facturas$ = this._facturaService.facturas$;
  isAdmin: boolean = false;

  constructor(
    private _facturaService: FacturaService,
    private _appStorageService: StorageService,
    private _authService: AuthService,
    private _modalCtrl: ModalController,
    private _actionSheetCtrl: ActionSheetController,
    private _alertCtrl: AlertController,
    private _toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this._facturaService.admin$.subscribe((admin) => {
      this.isAdmin = admin;
    });
  }

  async ionViewWillEnter() {
    this.user = await this._appStorageService.getObject('user');
    await this._facturaService.getFacturas();
  }

  async onClickFactura(factura: IFactura) {
    const actionSheet = await this._actionSheetCtrl.create({
      header: `Factura N° ${factura.idFactura}`,
      mode: 'ios',
      buttons: [
        {
          text: 'Ver',
          icon: 'eye-outline',
          role: 'view',
          handler: async () => {
            await this.openModalVer(factura);
          },
        },
        {
          text: 'Eliminar',
          icon: 'trash-outline',
          role: 'destructive',
          handler: async () => {
            const alert = await this._alertCtrl.create({
              header: 'Eliminar',
              message: `¿Está seguro que desea eliminar la factura N° ${factura.idFactura}?`,
              mode: 'ios',
              buttons: [
                {
                  text: 'Cancelar',
                  role: 'cancel',
                  handler: () => {},
                },
                {
                  text: 'Eliminar',
                  role: 'destructive',
                  handler: async () => {
                    const status = await this._facturaService.deleteFactura(
                      String(factura.idFactura)
                    );

                    if (status === 204) {
                      await this.createToast(
                        `Factura N° ${factura.idFactura} eliminada`,
                        'success',
                        2000
                      );
                    } else {
                      await this.createToast(
                        `Error al eliminar la factura N° ${factura.idFactura}`,
                        'danger',
                        2000
                      );
                    }
                  },
                },
              ],
            });

            await alert.present();
          },
          cssClass: this.isAdmin ? '' : 'ion-hide',
        },
        {
          text: 'Cancelar',
          icon: 'close-outline',
          role: 'cancel',
          handler: () => {},
        },
      ],
    });

    await actionSheet.present();
  }

  // Métodos
  async logout() {
    await this._authService.logout();
  }

  async openModalVer(factura: IFactura) {
    const modal = await this._modalCtrl.create({
      component: VerFacturaComponent,
      componentProps: {
        factura,
      },
      mode: 'ios',
    });

    await modal.present();
    const { data, role } = await modal.onWillDismiss();

    if (role === 'pagar') {
      const res = await this._facturaService.updateFactura(data);

      console.log(data, res);

      if (res == 204) {
        await this.createToast(
          `Factura N° ${factura.idFactura} pagada`,
          'success',
          2000
        );
      } else {
        await this.createToast(
          `Error al pagar la factura N° ${factura.idFactura}`,
          'danger',
          2000
        );
      }
    }
  }

  async createToast(message: string, color: string, duration: number) {
    const toast = await this._toastCtrl.create({
      message,
      color,
      duration,
      mode: 'ios',
    });

    await toast.present();
  }
}
