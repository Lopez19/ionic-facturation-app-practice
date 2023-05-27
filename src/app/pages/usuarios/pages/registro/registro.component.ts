import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { UsuariosService } from '../../../../services/usuarios.service';
import { Usuario } from '../../../../interfaces/usuario.interface';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
})
export class RegistroComponent implements OnInit {
  // Constructor
  constructor(
    private router: Router,
    private usuariosService: UsuariosService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private fb: FormBuilder
  ) {}

  // Properties
  roles$ = this.usuariosService.roles$;

  // Formulario
  form_registro = this.fb.group({
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
    password: ['', [Validators.required]],
    rolId: ['', [Validators.required]],
    DNI: ['', [Validators.required]],
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
  });

  // Lifecycle hooks
  ngOnInit() {}

  // Private methods
  get nombreNoValido() {
    return (
      this.form_registro.get('nombre')?.invalid &&
      this.form_registro.get('nombre')?.touched
    );
  }

  get apellidoNoValido() {
    return (
      this.form_registro.get('apellido')?.invalid &&
      this.form_registro.get('apellido')?.touched
    );
  }

  get passwordNoValido() {
    return (
      this.form_registro.get('password')?.invalid &&
      this.form_registro.get('password')?.touched
    );
  }

  get rolIdNoValido() {
    return (
      this.form_registro.get('rolId')?.invalid &&
      this.form_registro.get('rolId')?.touched
    );
  }

  get DNINoValido() {
    return (
      this.form_registro.get('DNI')?.invalid &&
      this.form_registro.get('DNI')?.touched
    );
  }

  get usernameNoValido() {
    return (
      this.form_registro.get('username')?.invalid &&
      this.form_registro.get('username')?.touched
    );
  }

  get emailNoValido() {
    return (
      this.form_registro.get('email')?.invalid &&
      this.form_registro.get('email')?.touched
    );
  }

  // Methods
  async onClickRegistrar() {
    if (this.form_registro.valid) {
      const usuario: Usuario = {
        nombre: this.form_registro.get('nombre')?.value ?? '',
        apellido: this.form_registro.get('apellido')?.value ?? '',
        password: this.form_registro.get('password')?.value ?? '',
        rolId: this.form_registro.get('rolId')?.value ?? '',
        DNI: Number(this.form_registro.get('DNI')?.value),
        username: this.form_registro.get('username')?.value ?? '',
        email: this.form_registro.get('email')?.value ?? '',
      };

      await this.usuariosService.addUsuario(usuario).then(() => {
        this.form_registro.reset();

        (async () => {
          const toast = await this.toastCtrl.create({
            message: `Usuario ${usuario.nombre} ${usuario.apellido} creado`,
            duration: 3000,
            position: 'bottom',
            color: 'success',
          });
          await toast.present();
          await this.router.navigate(['/usuarios']);
        })();
      });
    }
  }
}
