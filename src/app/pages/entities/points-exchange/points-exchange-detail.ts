import { Component, OnInit } from '@angular/core';
import { PointsExchange } from './points-exchange.model';
import { PointsExchangeService } from './points-exchange.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-points-exchange-detail',
  templateUrl: 'points-exchange-detail.html',
})
export class PointsExchangeDetailPage implements OnInit {
  pointsExchange: PointsExchange = {};

  constructor(
    private navController: NavController,
    private pointsExchangeService: PointsExchangeService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.pointsExchange = response.data;
    });
  }

  open(item: PointsExchange) {
    this.navController.navigateForward('/tabs/entities/points-exchange/' + item.id + '/edit');
  }

  async deleteModal(item: PointsExchange) {
    const alert = await this.alertController.create({
      header: 'Confirm the deletion?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Delete',
          handler: () => {
            this.pointsExchangeService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/points-exchange');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
