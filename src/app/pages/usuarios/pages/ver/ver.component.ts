import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Usuario } from '../../../../interfaces/usuario.interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ver',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.scss'],
})
export class VerComponent implements OnInit {
  constructor(
    private _usuariosService: UsuariosService,
    private _activatedRouter: ActivatedRoute
  ) {}

  user: Usuario = {
    rolId: '',
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    DNI: 0,
    username: '',
  };

  roles$ = this._usuariosService.roles$;

  ngOnInit() {
    const id = String(this._activatedRouter.snapshot.paramMap.get('id'));
    (async () => {
      await this.getUser(id);
    })();
  }

  async getUser(id: string) {
    const user = await this._usuariosService.getUsuarioById(id);

    this.roles$
      .subscribe((roles) => {
        const rol = roles.find((rol) => rol.idRol === user.rolId)?.nombre;
        user.rolId = rol ?? 'Sin rol';
      })
      .unsubscribe();

    this.user = user;
  }
}
