import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { CategoriasService } from 'src/app/services/categorias.service';
import { AuthService } from '../../../../services/auth.service';
import { StorageService } from '../../../../services/storage.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss'],
})
export class PrincipalComponent implements OnInit {
  // Propiedades
  categorias$ = this.categoriasService.categorias$;

  // Constructor
  constructor(
    private alerCrtl: AlertController,
    private categoriasService: CategoriasService,
    public authService: AuthService,
    public appStorageService: StorageService
  ) {}

  // Eventos
  ngOnInit() {
    this.categoriasService.getCategorias();
  }

  // Metodos
  onClickDelete(catId: number | undefined) {
    this.alerCrtl
      .create({
        header: 'Eliminar',
        message: '¿Está seguro de eliminar esta categoria?',
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
            handler: () => {
              this.__eliminarCat(catId);
            },
          },
        ],
      })
      .then((alert) => alert.present());
  }

  // Metodos privados
  private async __eliminarCat(catId: number | undefined) {
    const token = await this.appStorageService.get('token');
    if (token) {
      await this.categoriasService.deleteCategoria(catId as number, token);
    }
  }
}
