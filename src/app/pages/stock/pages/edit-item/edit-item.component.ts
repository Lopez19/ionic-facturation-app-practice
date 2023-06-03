import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { IStock } from 'src/app/interfaces/stock.interface';
import { ProductosService } from 'src/app/services/productos.service';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss'],
})
export class EditItemComponent implements OnInit {
  @Input() item: IStock | undefined;

  constructor(
    private _modalCtrl: ModalController,
    private _fb: FormBuilder,
    private _productosService: ProductosService,
    private _stockService: StockService,
    private _toastCtrl: ToastController
  ) {}

  productos$ = this._productosService.productos$;

  data = this._fb.group({
    cantidad: [0, [Validators.required, Validators.min(1)]],
    productoId: [0, [Validators.required, Validators.min(1)]],
    nombre: ['', [Validators.required]],
  });

  ngOnInit() {
    (async () => {
      if (this.item) {
        await this.llenarFormulario(this.item.iditem as number);
      }
    })();
  }

  cancel() {
    return this._modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    const data = {
      iditem: this.item?.iditem,
      cantidad: this.data.get('cantidad')?.value,
      productoId: this.data.get('productoId')?.value,
    };
    return this._modalCtrl.dismiss(data, 'ok');
  }

  async onSubmit() {
    if (this.data.valid) {
      await this.confirm();
    } else {
      const toast = await this._toastCtrl.create({
        message: 'Formulario inválido',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
    }
  }

  async llenarFormulario(itemId: number) {
    const { status } = await this._stockService.getStockById(itemId);

    if (status === 200) {
      this.data.setValue({
        cantidad: Number(this.item?.cantidad),
        productoId: Number(this.item?.productoId),
        nombre: String(this.item?.nombre),
      });

      const toast = await this._toastCtrl.create({
        message: 'Item cargado',
        duration: 2000,
        color: 'success',
      });
      await toast.present();
    } else {
      const toast = await this._toastCtrl.create({
        message: 'Error al cargar el item',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
    }
  }
}
