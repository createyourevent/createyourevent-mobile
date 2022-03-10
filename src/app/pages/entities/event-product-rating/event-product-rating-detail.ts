import { Component, OnInit } from '@angular/core';
import { EventProductRating } from './event-product-rating.model';
import { EventProductRatingService } from './event-product-rating.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-event-product-rating-detail',
  templateUrl: 'event-product-rating-detail.html',
})
export class EventProductRatingDetailPage implements OnInit {
  eventProductRating: EventProductRating = {};

  constructor(
    private navController: NavController,
    private eventProductRatingService: EventProductRatingService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.eventProductRating = response.data;
    });
  }

  open(item: EventProductRating) {
    this.navController.navigateForward('/tabs/entities/event-product-rating/' + item.id + '/edit');
  }

  async deleteModal(item: EventProductRating) {
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
            this.eventProductRatingService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/event-product-rating');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
