import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IProducto } from 'src/app/interfaces/producto.interface';
import { ProductosService } from 'src/app/services/productos.service';
import { CategoriasService } from 'src/app/services/categorias.service';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  constructor(
    private _activatedRoute: ActivatedRoute,
    public productosService: ProductosService,
    public categoriasService: CategoriasService,
    private fb: FormBuilder,
    private _router: Router,
    private _alertCtrl: AlertController,
    private _toastCtrl: ToastController
  ) {}

  categorias$ = this.categoriasService.categorias$;

  form_editar_producto = this.fb.group({
    nombre: ['', [Validators.required]],
    detalle: ['', [Validators.required]],
    precio: [0, [Validators.required]],
    categoriaId: [0, [Validators.required]],
  });

  ngOnInit() {
    (async () => {
      await this.obtenerProducto();
    })();
  }

  public async updateProducto() {
    if (this.form_editar_producto.valid) {
      const id = Number(this._activatedRoute.snapshot.paramMap.get('id'));

      const producto: IProducto = {
        nombre: String(this.form_editar_producto.value.nombre),
        detalle: String(this.form_editar_producto.value.detalle),
        precio: Number(this.form_editar_producto.value.precio),
        categoriaId: Number(this.form_editar_producto.value.categoriaId),
      };

      const res = await this.productosService.updateProducto(producto, id);

      if (res === 204) {
        const toast = await this._toastCtrl.create({
          message: `Producto ${producto.nombre} actualizado correctamente.`,
          duration: 2000,
          color: 'success',
        });

        await toast.present();

        await toast.onDidDismiss().then(() => {
          (async () => {
            this.form_editar_producto.reset();
            await this._router.navigate(['/productos']);
          })();
        });
      }
    }
  }

  public async obtenerProducto() {
    const id = Number(this._activatedRoute.snapshot.paramMap.get('id'));

    const producto = await this.productosService.getProductoById(id);

    this.form_editar_producto.setValue({
      nombre: producto.nombre,
      detalle: producto.detalle,
      precio: producto.precio,
      categoriaId: Number(producto.categoriaId),
    });
  }
}
