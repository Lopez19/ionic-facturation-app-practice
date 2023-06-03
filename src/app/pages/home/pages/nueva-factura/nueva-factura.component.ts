import { Component } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { FacturaService } from 'src/app/services/factura.service';
import { StorageService } from 'src/app/services/storage.service';
import { Usuario } from '../../../../interfaces/usuario.interface';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { AddItemComponent } from '../add-item/add-item.component';
import { IFactura } from 'src/app/interfaces/factura.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nueva-factura',
  templateUrl: './nueva-factura.component.html',
  styleUrls: ['./nueva-factura.component.scss'],
})
export class NuevaFacturaComponent {
  constructor(
    private _toastCtrl: ToastController,
    private _facturaService: FacturaService,
    private _appStorageService: StorageService,
    private _usuariosService: UsuariosService,
    private _fb: FormBuilder,
    private _modalCtrl: ModalController,
    private _router: Router
  ) {}

  // Formulario
  factura = this._fb.group({
    encabezado: this._fb.group({
      Emisor: this._fb.group({
        RUTEmisor: ['', [Validators.required, Validators.minLength(9)]],
        RznSocEmi: ['', [Validators.required, Validators.maxLength(200)]],
      }),
      Receptor: this._fb.group({
        RUTRecep: ['', [Validators.required, Validators.minLength(9)]],
        RznSocRecep: ['', [Validators.required, Validators.maxLength(200)]],
        DirRecep: ['', [Validators.required, Validators.maxLength(200)]],
        CiudadRecep: ['', [Validators.required, Validators.maxLength(200)]],
      }),
    }),
    detalle: this._fb.array([], [Validators.required, Validators.minLength(1)]),
    totales: this._fb.group({
      MntNeto: [0],
      TasaIVA: ['19%'],
      IVA: [0],
      MntTotal: [0],
    }),
    estadoId: ['', [Validators.required]],
  });

  // Propiedades
  private _receptorFound!: Usuario | undefined;
  remitente: Usuario = {} as Usuario;
  usuarios$ = this._usuariosService.usuarios$;
  estado$ = this._facturaService.status$;

  // Eventos de Ionic
  async ionViewWillEnter() {
    await this._setValuesEmisor();
  }

  // Validadores
  get RUTEmisor() {
    return this.factura.get('encabezado.Emisor.RUTEmisor')?.valid;
  }
  get RznSocEmi() {
    return this.factura.get('encabezado.Emisor.RznSocEmi')?.valid;
  }
  get RUTRecep() {
    return this.factura.get('encabezado.Receptor.RUTRecep')?.valid;
  }
  get RznSocRecep() {
    return this.factura.get('encabezado.Receptor.RznSocRecep')?.valid;
  }
  get DirRecep() {
    return this.factura.get('encabezado.Receptor.DirRecep')?.valid;
  }
  get CiudadRecep() {
    return this.factura.get('encabezado.Receptor.CiudadRecep')?.valid;
  }
  get detalle() {
    return this.factura.controls['detalle'] as FormArray;
  }
  get MntNeto() {
    return this.factura.get('totales.MntNeto');
  }
  get TasaIVA() {
    return this.factura.get('totales.TasaIVA');
  }
  get IVA() {
    return this.factura.get('totales.IVA');
  }
  get MntTotal() {
    return this.factura.get('totales.MntTotal');
  }
  get estadoId() {
    return this.factura.get('estadoId');
  }

  // Metodos privados
  private async _presentToast(
    message: string,
    color: string,
    duration: number
  ) {
    const toast = await this._toastCtrl.create({
      message,
      duration,
      color,
    });
    await toast.present();
  }

  private async _setValuesEmisor() {
    this.remitente = await this._appStorageService.getObject('user');
  }

  // Metodos publicos
  async onSubmit() {
    const factura = this.factura.value as IFactura;
    const res = await this._facturaService.createFactura(factura);

    if (res !== 200) {
      await this._presentToast('Error al crear factura', 'danger', 2000);
      await this._router.navigateByUrl('/home');
    } else {
      await this._presentToast('Factura creada', 'success', 2000);
      await this._router.navigateByUrl('/home');
    }
    this.factura.reset();
  }

  async handleChange(e: Event) {
    const custom = e as CustomEvent;
    const rut = custom.detail.value;

    this.usuarios$.subscribe((usuarios) => {
      this._receptorFound = usuarios.find((usuario) => usuario.DNI === rut);
    });

    if (this._receptorFound) {
      this.factura.get('encabezado.Receptor')?.patchValue({
        RUTRecep: rut,
        RznSocRecep: `${this._receptorFound.nombre} ${this._receptorFound.apellido}`,
        DirRecep: 'Direccion',
        CiudadRecep: 'Ciudad',
      });
    }
  }

  async addItem() {
    const modal = await this._modalCtrl.create({
      component: AddItemComponent,
      mode: 'ios',
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'ok') {
      const setDetails = this._fb.group({
        NmbItem: [data.NmbItem, [Validators.required]],
        QtyItem: [data.QtyItem, [Validators.required]],
        PrcItem: [data.PrcItem, [Validators.required]],
        DscItem: [data.DscItem, [Validators.required]],
      });

      this.detalle.push(setDetails);

      await this._presentToast('Item agregado', 'success', 2000);
    }

    await this.calcularTotales();
  }

  async removeItem(index: number) {
    const detalles = this.factura.get('detalle') as any;
    detalles.removeAt(index);
    await this._presentToast('Item eliminado', 'success', 2000);

    await this.calcularTotales();
  }

  async calcularTotales() {
    const detalles = this.factura.get('detalle') as any;
    const neto = detalles.value.reduce(
      (acc: number, item: any) => acc + item.PrcItem * item.QtyItem,
      0
    );
    const iva = neto * 0.19;
    const total = neto + iva;

    this.factura.get('totales')?.patchValue({
      TasaIVA: '19%',
      MntNeto: neto,
      IVA: iva,
      MntTotal: total,
    });
  }
}
