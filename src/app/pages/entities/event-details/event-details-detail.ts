import { Component, OnInit } from '@angular/core';
import { EventDetails } from './event-details.model';
import { EventDetailsService } from './event-details.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-event-details-detail',
  templateUrl: 'event-details-detail.html',
})
export class EventDetailsDetailPage implements OnInit {
  eventDetails: EventDetails = {};

  constructor(
    private navController: NavController,
    private eventDetailsService: EventDetailsService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.eventDetails = response.data;
    });
  }

  open(item: EventDetails) {
    this.navController.navigateForward('/tabs/entities/event-details/' + item.id + '/edit');
  }

  async deleteModal(item: EventDetails) {
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
            this.eventDetailsService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/event-details');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
