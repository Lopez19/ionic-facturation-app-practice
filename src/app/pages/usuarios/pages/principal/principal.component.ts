import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from '../../../../services/usuarios.service';
import { Usuario } from '../../../../interfaces/usuario.interface';
import { Observable } from 'rxjs';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss'],
})
export class PrincipalComponent implements OnInit {
  // Constructor
  constructor(
    private router: Router,
    private usuariosService: UsuariosService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  // Properties
  usuarios$: Observable<Usuario[]> = this.usuariosService.usuarios$;

  ngOnInit() {}

  // Methods
  async onClickDelete(user: Usuario) {
    await this.alertCtrl
      .create({
        header: 'Eliminar',
        message: '¿Está seguro de eliminar este usuario?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              console.log('Cancelar');
            },
          },
          {
            text: 'Eliminar',
            handler: async () => {
              await this.__eliminarUsuario(user);
            },
          },
        ],
      })
      .then((alert) => alert.present());
  }

  // Private methods
  private async __eliminarUsuario(user: Usuario) {
    if (user.idUsuario !== '64694c3b7fcabc37f0bac8f0') {
      await this.usuariosService.deleteUsuario(user);

      const toast = await this.toastCtrl.create({
        message: `Usuario ${user.nombre} eliminado con éxito`,
        duration: 2000,
        color: 'primary',
      });
      await toast.present();
    } else {
      const toast = await this.toastCtrl.create({
        message: `No se puede eliminar al usuario ${user.nombre} porque es el usuario superadmin`,
        duration: 5000,
        color: 'danger',
      });
      await toast.present();
    }
  }
}
