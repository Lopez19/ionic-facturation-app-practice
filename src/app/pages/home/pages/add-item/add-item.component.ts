import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { StockService } from 'src/app/services/stock.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss'],
})
export class AddItemComponent implements OnInit {
  // Constructor
  constructor(
    private _fb: FormBuilder,
    private _stockService: StockService,
    private _modalCtrl: ModalController
  ) {}

  ngOnInit() {}

  // Propiedades
  dataItem = this._fb.group({
    // Marcar como opcionales los campos que no son requeridos
    NmbItem: [0],
    DscItem: ['', [Validators.required, Validators.maxLength(200)]],
    QtyItem: [1, [Validators.required, Validators.min(1)]],
    PrcItem: [0, [Validators.required, Validators.min(1)]],
  });

  stock$ = this._stockService.stock$;

  // Eventos
  async cancel() {
    return await this._modalCtrl.dismiss(null, 'cancel');
  }

  async save() {
    return await this._modalCtrl.dismiss(this.dataItem.value, 'ok');
  }

  // Getters de validación
  get NmbItem() {
    return this.dataItem.get('NmbItem')?.value;
  }
  get DscItem() {
    return this.dataItem.get('DscItem');
  }
  get QtyItem() {
    return this.dataItem.get('QtyItem');
  }
  get PrcItem() {
    return this.dataItem.get('PrcItem');
  }

  // Métodos Publicos
  async onChange(e: Event) {
    const ev = e as CustomEvent;
    const value = ev.detail.value;

    await this.stock$.forEach((productos) => {
      const producto = productos.find(
        (stockProduct) => stockProduct.iditem === value
      );

      if (producto) {
        this.dataItem.patchValue({
          DscItem: producto.des,
          PrcItem: producto.precio,
        });
      }
    });
  }
}
