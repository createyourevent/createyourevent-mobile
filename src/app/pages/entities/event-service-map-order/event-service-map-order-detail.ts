import { Component, OnInit } from '@angular/core';
import { EventServiceMapOrder } from './event-service-map-order.model';
import { EventServiceMapOrderService } from './event-service-map-order.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-event-service-map-order-detail',
  templateUrl: 'event-service-map-order-detail.html',
})
export class EventServiceMapOrderDetailPage implements OnInit {
  eventServiceMapOrder: EventServiceMapOrder = {};

  constructor(
    private navController: NavController,
    private eventServiceMapOrderService: EventServiceMapOrderService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.eventServiceMapOrder = response.data;
    });
  }

  open(item: EventServiceMapOrder) {
    this.navController.navigateForward('/tabs/entities/event-service-map-order/' + item.id + '/edit');
  }

  async deleteModal(item: EventServiceMapOrder) {
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
            this.eventServiceMapOrderService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/event-service-map-order');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
