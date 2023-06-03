import { Component, OnInit } from '@angular/core';
import { ProductosService } from 'src/app/services/productos.service';
import { Observable } from 'rxjs';
import { IProducto } from 'src/app/interfaces/producto.interface';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CategoriasService } from 'src/app/services/categorias.service';
import { ICategoria } from 'src/app/interfaces/categoria.interface';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-nuevo',
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.scss'],
})
export class NuevoComponent implements OnInit {
  constructor(
    private _productosService: ProductosService,
    private _categoriasService: CategoriasService,
    private _alertCtrl: AlertController,
    private _toastCtrl: ToastController,
    private _router: Router,
    private _fb: FormBuilder
  ) {}

  // Propiedades
  categorias$: Observable<ICategoria[]> = this._categoriasService.categorias$;

  form_nuevo_producto = this._fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    detalle: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(200)],
    ],
    precio: [
      '',
      [Validators.required, Validators.min(0), Validators.max(999999999)],
    ],
    categoriaId: ['', [Validators.required, Validators.min(1)]],
  });

  ngOnInit() {}

  // Methods
  async onSubmit() {
    if (this.form_nuevo_producto.valid) {
      const formValue = this.form_nuevo_producto.value;

      const producto: IProducto = {
        nombre: String(formValue.nombre),
        detalle: String(formValue.detalle),
        precio: Number(formValue.precio),
        categoriaId: Number(formValue.categoriaId),
      };

      const res = await this._productosService.createProducto(producto);

      if (res === 200) {
        this.form_nuevo_producto.reset();
        await this._toastCtrl
          .create({
            message: 'Producto creado con éxito',
            duration: 2000,
            color: 'success',
          })
          .then((toast) => toast.present());
        await this._router.navigate(['/productos']);
      } else {
        await this._alertCtrl
          .create({
            header: 'Error',
            message: 'No se pudo crear el producto',
            buttons: ['Ok'],
          })
          .then((alert) => alert.present());
      }
    }
  }
}
