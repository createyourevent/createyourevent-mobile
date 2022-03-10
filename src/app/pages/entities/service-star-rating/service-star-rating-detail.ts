import { Component, OnInit } from '@angular/core';
import { ServiceStarRating } from './service-star-rating.model';
import { ServiceStarRatingService } from './service-star-rating.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-service-star-rating-detail',
  templateUrl: 'service-star-rating-detail.html',
})
export class ServiceStarRatingDetailPage implements OnInit {
  serviceStarRating: ServiceStarRating = {};

  constructor(
    private navController: NavController,
    private serviceStarRatingService: ServiceStarRatingService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.serviceStarRating = response.data;
    });
  }

  open(item: ServiceStarRating) {
    this.navController.navigateForward('/tabs/entities/service-star-rating/' + item.id + '/edit');
  }

  async deleteModal(item: ServiceStarRating) {
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
            this.serviceStarRatingService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/service-star-rating');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
