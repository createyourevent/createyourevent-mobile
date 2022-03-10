import { Component, OnInit } from '@angular/core';
import { EventProductOrder } from './event-product-order.model';
import { EventProductOrderService } from './event-product-order.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-event-product-order-detail',
  templateUrl: 'event-product-order-detail.html',
})
export class EventProductOrderDetailPage implements OnInit {
  eventProductOrder: EventProductOrder = {};

  constructor(
    private navController: NavController,
    private eventProductOrderService: EventProductOrderService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.eventProductOrder = response.data;
    });
  }

  open(item: EventProductOrder) {
    this.navController.navigateForward('/tabs/entities/event-product-order/' + item.id + '/edit');
  }

  async deleteModal(item: EventProductOrder) {
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
            this.eventProductOrderService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/event-product-order');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
