import { Component, OnInit } from '@angular/core';
import { ProductosService } from 'src/app/services/productos.service';
import { Observable } from 'rxjs';
import { IProducto } from 'src/app/interfaces/producto.interface';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss'],
})
export class PrincipalComponent implements OnInit {
  constructor(
    private _productosService: ProductosService,
    private _alertCtrl: AlertController,
    private _toastCtrl: ToastController
  ) {}

  // Propiedades
  productos$: Observable<IProducto[]> = this._productosService.productos$;

  ngOnInit() {}

  // Methods
  public async deleteProducto(producto: IProducto): Promise<void> {
    const alert = await this._alertCtrl.create({
      header: 'Eliminar producto',
      message: `¿Está seguro de eliminar el producto ${producto.nombre}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: async () => {
            await this.__eliminarProducto(producto);
          },
        },
      ],
    });

    await alert.present();
  }

  // Private methods
  private async __eliminarProducto(producto: IProducto): Promise<void> {
    const res = await this._productosService.deleteProducto(producto);

    if (res === 204) {
      const toast = await this._toastCtrl.create({
        message: `El producto ${producto.nombre} se eliminó correctamente`,
        duration: 2000,
        color: 'success',
      });

      await toast.present();
    } else {
      const toast = await this._toastCtrl.create({
        message: `El producto ${producto.nombre} no se pudo eliminar`,
        duration: 2000,
        color: 'danger',
      });

      await toast.present();
    }
  }
}
