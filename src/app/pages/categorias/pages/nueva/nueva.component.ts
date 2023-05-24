import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CategoriasService } from 'src/app/services/categorias.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-nueva',
  templateUrl: './nueva.component.html',
  styleUrls: ['./nueva.component.scss'],
})
export class NuevaComponent {
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
  form_nueva = new FormGroup({
    nombre: new FormControl('', [
      Validators.required,
      Validators.pattern(this.regx_nombre),
    ]),
  });

  nombre: string = '';
  mensaje: string = '';

  // Constructor
  constructor(
    private router: Router,
    private categoriasService: CategoriasService,
    private appStorageService: StorageService,
    private authService: AuthService
  ) {}

  // Metodos
  async onClickSave() {
    if (this.form_nueva.valid) {
      this.nombre = this.form_nueva.get('nombre')?.value as string;
      const token: string = await this.authService.voToken();

      const categoria = {
        nombre: this.nombre,
      };

      const res = await this.categoriasService.createCategoria(
        categoria,
        token
      );

      if (res) {
        this.form_nueva.reset();
        this.mensaje = `Categoria ${this.nombre} creada correctamente`;
        this.appStorageService.set('mensaje', this.mensaje);
        this.router.navigate(['/categorias/viewAll']);
      }
    } else {
      console.log('Formulario invalido');
    }
  }

  get nombreNoValido() {
    return (
      this.form_nueva.get('nombre')?.invalid &&
      this.form_nueva.get('nombre')?.touched
    );
  }
}
