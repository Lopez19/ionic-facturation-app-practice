import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FacturaService } from 'src/app/services/factura.service';
import { factura } from '../../../interfaces/factura.interface';

@Component({
  selector: 'app-fac-detail',
  templateUrl: './fac-detail.page.html',
  styleUrls: ['./fac-detail.page.scss'],
})
export class FacDetailPage implements OnInit {
  factura!: factura;

  constructor(
    private activedRoute: ActivatedRoute,
    private facturaService: FacturaService,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.activedRoute.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('idFactura') as string;
      this.factura = this.facturaService.getFacturaById(id) as factura;
      // console.log(this.factura);
    });
  }

  async deleteFact() {
    const alertE = await this.alertCtrl.create({
      header: 'Eliminar factura',
      message: '¿Está seguro de eliminar la factura?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: () => {
            const id = this.factura.id?.toString() as string;
            this.facturaService.deleteFactura(id);
            this.router.navigate(['/home']);
          },
        },
      ],
    });

    await alertE.present();
  }
}
