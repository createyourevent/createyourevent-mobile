import { Component, OnInit } from '@angular/core';
import { EventStarRating } from './event-star-rating.model';
import { EventStarRatingService } from './event-star-rating.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-event-star-rating-detail',
  templateUrl: 'event-star-rating-detail.html',
})
export class EventStarRatingDetailPage implements OnInit {
  eventStarRating: EventStarRating = {};

  constructor(
    private navController: NavController,
    private eventStarRatingService: EventStarRatingService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.eventStarRating = response.data;
    });
  }

  open(item: EventStarRating) {
    this.navController.navigateForward('/tabs/entities/event-star-rating/' + item.id + '/edit');
  }

  async deleteModal(item: EventStarRating) {
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
            this.eventStarRatingService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/event-star-rating');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
