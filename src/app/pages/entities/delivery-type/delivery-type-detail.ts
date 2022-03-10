import { Component, OnInit } from '@angular/core';
import { DeliveryType } from './delivery-type.model';
import { DeliveryTypeService } from './delivery-type.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-delivery-type-detail',
  templateUrl: 'delivery-type-detail.html',
})
export class DeliveryTypeDetailPage implements OnInit {
  deliveryType: DeliveryType = {};

  constructor(
    private navController: NavController,
    private deliveryTypeService: DeliveryTypeService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.deliveryType = response.data;
    });
  }

  open(item: DeliveryType) {
    this.navController.navigateForward('/tabs/entities/delivery-type/' + item.id + '/edit');
  }

  async deleteModal(item: DeliveryType) {
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
            this.deliveryTypeService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/delivery-type');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
