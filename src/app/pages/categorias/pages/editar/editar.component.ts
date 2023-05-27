import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CategoriasService } from 'src/app/services/categorias.service';
import { StorageService } from 'src/app/services/storage.service';
import { ICategoria } from '../../../../interfaces/categoria.interface';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.scss'],
})
export class EditarComponent implements OnInit {
  /**
   * Expresion regular para validar el nombre de la categoria
   * 3 a 30 caracteres, solo letras minusculas, numeros y espacios
   * @example 'categoria 1'
   * @example 'categoria'
   *
   *
   * @type {RegExp}
   * @memberof NuevaComponent
   */
  regx_nombre: RegExp = /^[a-z0-9ñáéíóú ]{3,30}$/;

  // Propiedades
  nombre: string = '';
  mensaje: string = '';

  form_edit = new FormGroup({
    nombre: new FormControl('', [
      Validators.required,
      Validators.pattern(this.regx_nombre),
    ]),
  });

  // Constructor
  constructor(
    private router: Router,
    private categoriasService: CategoriasService,
    private appStorageService: StorageService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.agregarNombreCategoria().catch((error) => console.log(error));
  }

  // Metodos
  async onClickSaveEdit() {
    if (this.form_edit.valid) {
      this.nombre = this.form_edit.get('nombre')?.value as string;
      const token: string = await this.appStorageService.get('token');

      const categoria: ICategoria = {
        idcategoria: Number(this.activatedRoute.snapshot.paramMap.get('id')),
        nombre: this.nombre,
      };

      const res = await this.categoriasService.updateCategoria(
        categoria,
        token
      );

      if (!res.error) {
        this.form_edit.reset();
        this.mensaje = `Categoria ${this.nombre} editada correctamente`;
        await this.appStorageService.set('mensaje', this.mensaje);
        await this.router.navigate(['/categorias/viewAll']);
      } else {
        console.log(res.error);
      }
    } else {
      console.log('Formulario invalido');
    }
  }

  get nombreNoValido() {
    return (
      this.form_edit.get('nombre')?.invalid &&
      this.form_edit.get('nombre')?.touched
    );
  }

  set nombreCategoria(nombre: string) {
    this.form_edit.get('nombre')?.setValue(nombre);
  }

  async agregarNombreCategoria() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    const token: string = await this.appStorageService.get('token');

    const categoria: ICategoria = await this.categoriasService.getCategoriaById(
      id as string,
      token
    );

    this.nombreCategoria = categoria.nombre;
    console.log(categoria);
  }
}
