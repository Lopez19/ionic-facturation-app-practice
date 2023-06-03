import { Component, OnInit } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { ProductosService } from 'src/app/services/productos.service';
import { StockService } from 'src/app/services/stock.service';
import { IStock } from '../../../../interfaces/stock.interface';
import { NuevoItemComponent } from '../nuevo-item/nuevo-item.component';
import { EditItemComponent } from '../edit-item/edit-item.component';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss'],
})
export class PrincipalComponent implements OnInit {
  constructor(
    private _stockService: StockService,
    private _productosService: ProductosService,
    private _actionSheetCtrl: ActionSheetController,
    private _modalCtrl: ModalController,
    private _toastCtrl: ToastController,
    private _alertCtrl: AlertController
  ) {}

  stock$ = this._stockService.stock$;
  productos$ = this._productosService.productos$;

  ngOnInit() {}

  // Méthods
  async goToStockActions(item: IStock) {
    const actionSheet = await this._actionSheetCtrl.create({
      header: `${item.nombre} - ${item.cantidad} unidades`,
      buttons: [
        {
          text: 'Editar',
          icon: 'create-outline',
          role: 'edit',
          handler: async () => {
            await this.openModalEdit(item);
          },
        },
        {
          text: 'Eliminar',
          icon: 'trash-outline',
          role: 'destructive',
          handler: async () => {
            const { status } = await this._stockService.deleteStock(
              item.iditem as number
            );
            console.log(status);

            if (status === 204) {
              const toast = await this._toastCtrl.create({
                message: `${item.nombre} eliminado`,
                duration: 2000,
                color: 'danger',
              });
              await toast.present();
            } else {
              const toast = await this._toastCtrl.create({
                message: `Error al eliminar ${item.nombre}`,
                duration: 2000,
                color: 'danger',
              });
              await toast.present();
            }
          },
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
          handler: () => {},
        },
      ],
    });

    await actionSheet.present();
  }

  // Modal
  async openModalCreate() {
    const modal = await this._modalCtrl.create({
      component: NuevoItemComponent,
      mode: 'ios',
    });
    await modal.present();

    const { data, role } = await modal.onDidDismiss();
    const item: IStock = data;

    if (role === 'ok') {
      await this._stockService.addStock(item);
      const toast = await this._toastCtrl.create({
        message: 'Item agregado',
        duration: 2000,
        color: 'success',
      });
      await toast.present();
    }

    if (role === 'cancel') {
      const toast = await this._toastCtrl.create({
        message: 'Cancelado',
        duration: 2000,
        color: 'medium',
      });
      await toast.present();
    }
  }

  async openModalEdit(item: IStock) {
    const modal = await this._modalCtrl.create({
      component: EditItemComponent,
      componentProps: {
        item,
      },
      mode: 'ios',
    });
    await modal.present();

    const { data, role } = await modal.onDidDismiss();
    const newItem: IStock = data;

    if (role === 'ok') {
      await this._stockService.updateStock(newItem);
      const toast = await this._toastCtrl.create({
        message: `Item actualizado a ${newItem.cantidad} unidades`,
        duration: 2000,
        color: 'success',
      });
      await toast.present();
    }
  }
}
