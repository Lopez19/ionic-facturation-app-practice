import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { UsuariosService } from '../../../../services/usuarios.service';
import { Usuario } from '../../../../interfaces/usuario.interface';
import { FormBuilder, Validators } from '@angular/forms';
import { RolesService } from 'src/app/services/roles.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  // Constructor
  constructor(
    private router: Router,
    private usuariosService: UsuariosService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private rolesServices: RolesService
  ) {}

  // Properties
  roles$ = this.rolesServices.roles$;

  // Formulario
  form_edit = this.fb.group({
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
    password: [''],
    rolId: ['', [Validators.required]],
    DNI: ['', [Validators.required]],
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
  });

  // Lifecycle hooks
  ngOnInit() {
    (async () => {
      await this.llenarFormulario();
    })();
  }

  // Private methods
  get nombreNoValido() {
    return (
      this.form_edit.get('nombre')?.invalid &&
      this.form_edit.get('nombre')?.touched
    );
  }

  get apellidoNoValido() {
    return (
      this.form_edit.get('apellido')?.invalid &&
      this.form_edit.get('apellido')?.touched
    );
  }

  get passwordNoValido() {
    return (
      this.form_edit.get('password')?.invalid &&
      this.form_edit.get('password')?.touched
    );
  }

  get rolIdNoValido() {
    return (
      this.form_edit.get('rolId')?.invalid &&
      this.form_edit.get('rolId')?.touched
    );
  }

  get DNINoValido() {
    return (
      this.form_edit.get('DNI')?.invalid && this.form_edit.get('DNI')?.touched
    );
  }

  get usernameNoValido() {
    return (
      this.form_edit.get('username')?.invalid &&
      this.form_edit.get('username')?.touched
    );
  }

  get emailNoValido() {
    return (
      this.form_edit.get('email')?.invalid &&
      this.form_edit.get('email')?.touched
    );
  }

  // Methods
  async onClickEditar() {
    if (this.form_edit.valid) {
      const id = this.activatedRoute.snapshot.paramMap.get('id');
      const usuario: Usuario = {
        nombre: this.form_edit.value.nombre ?? '',
        apellido: this.form_edit.value.apellido ?? '',
        password: this.form_edit.value.password ?? '',
        rolId: this.form_edit.value.rolId ?? '',
        DNI: Number(this.form_edit.value.DNI) ?? 0,
        username: this.form_edit.value.username ?? '',
        email: this.form_edit.value.email ?? '',
      };

      if (id) {
        const res = await this.usuariosService.updateUsuario(usuario, id);

        if (res === 204) {
          const toast = await this.toastCtrl.create({
            message: `Usuario ${usuario.nombre} actualizado correctamente`,
            duration: 2000,
            color: 'success',
          });

          await toast.present();
          await this.router.navigate(['/usuarios']);
        } else {
          const alert = await this.alertCtrl.create({
            header: 'Error',
            message: 'No se pudo actualizar el usuario',
            buttons: ['OK'],
          });

          await alert.present();
        }
      } else {
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: 'No se pudo actualizar el usuario',
          buttons: ['OK'],
        });

        await alert.present();
      }
    }
  }

  // Setters
  set valuesFormEdit(usuario: Usuario) {
    this.form_edit.setValue({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      password: '',
      rolId: usuario.rolId,
      DNI: String(usuario.DNI),
      username: usuario.username,
      email: usuario.email,
    });
  }

  async llenarFormulario() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    if (id) {
      const usuario = await this.usuariosService.getUsuarioById(id);

      if (usuario) {
        this.valuesFormEdit = usuario;
      }
    }
  }
}
