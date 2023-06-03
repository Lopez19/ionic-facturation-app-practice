import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IFactura } from 'src/app/interfaces/factura.interface';
import * as JsBarcode from 'jsbarcode';
import { FacturaService } from '../../../../services/factura.service';

@Component({
  selector: 'app-ver-factura',
  templateUrl: './ver-factura.component.html',
  styleUrls: ['./ver-factura.component.scss'],
})
export class VerFacturaComponent implements OnInit {
  @Input() factura!: IFactura;

  constructor(
    private _modalCtrl: ModalController,
    private _facturaServices: FacturaService
  ) {}

  status$ = this._facturaServices.status$;

  ngOnInit() {}

  cancel() {
    return this._modalCtrl.dismiss(null, 'cancel');
  }

  async ionViewDidEnter() {
    await this.generateBarcode();
  }

  async generateBarcode() {
    const canvas = document.getElementById('barcode') as HTMLCanvasElement;
    JsBarcode(canvas, this.factura.idFactura ?? '', {
      format: 'CODE128',
      lineColor: '#000',
      width: 2,
      height: 50,
      displayValue: true,
      margin: 0,
    });
  }

  async pagar() {
    const data = this.factura;

    this.status$.subscribe((status) => {
      status.forEach((s) => {
        // Si el estado es pendiente, se cambia a pagado
        if (s.nombre === 'pendiente') {
          data.estadoId = '63f4139f9ef22c40602a3a6c';
        }
      });
    });

    console.log(data);

    return this._modalCtrl.dismiss(data, 'pagar');
  }
}
