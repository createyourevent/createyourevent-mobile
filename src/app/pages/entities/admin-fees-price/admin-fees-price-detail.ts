import { Component, OnInit } from '@angular/core';
import { AdminFeesPrice } from './admin-fees-price.model';
import { AdminFeesPriceService } from './admin-fees-price.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-admin-fees-price-detail',
  templateUrl: 'admin-fees-price-detail.html',
})
export class AdminFeesPriceDetailPage implements OnInit {
  adminFeesPrice: AdminFeesPrice = {};

  constructor(
    private navController: NavController,
    private adminFeesPriceService: AdminFeesPriceService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.adminFeesPrice = response.data;
    });
  }

  open(item: AdminFeesPrice) {
    this.navController.navigateForward('/tabs/entities/admin-fees-price/' + item.id + '/edit');
  }

  async deleteModal(item: AdminFeesPrice) {
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
            this.adminFeesPriceService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/admin-fees-price');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
