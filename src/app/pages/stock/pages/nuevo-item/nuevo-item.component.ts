import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ProductosService } from '../../../../services/productos.service';

@Component({
  selector: 'app-nuevo-item',
  templateUrl: './nuevo-item.component.html',
  styleUrls: ['./nuevo-item.component.scss'],
})
export class NuevoItemComponent implements OnInit {
  constructor(
    private _modalCtrl: ModalController,
    private _fb: FormBuilder,
    private productosService: ProductosService
  ) {}
  productos$ = this.productosService.productos$;
  data = this._fb.group({
    cantidad: [0, [Validators.required, Validators.min(1)]],
    productoId: [0, [Validators.required, Validators.min(1)]],
  });

  get productoId() {
    return this.data.get('productoId')?.valid;
  }

  ngOnInit() {}

  cancel() {
    return this._modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this._modalCtrl.dismiss(this.data.value, 'ok');
  }

  async onSubmit() {
    if (this.data.valid) {
      await this.confirm();
    } else {
      console.log('Formulario inválido');
    }
  }
}
