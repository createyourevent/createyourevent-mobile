import { Component, OnInit } from '@angular/core';
import { OrganizationStarRating } from './organization-star-rating.model';
import { OrganizationStarRatingService } from './organization-star-rating.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-organization-star-rating-detail',
  templateUrl: 'organization-star-rating-detail.html',
})
export class OrganizationStarRatingDetailPage implements OnInit {
  organizationStarRating: OrganizationStarRating = {};

  constructor(
    private navController: NavController,
    private organizationStarRatingService: OrganizationStarRatingService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.organizationStarRating = response.data;
    });
  }

  open(item: OrganizationStarRating) {
    this.navController.navigateForward('/tabs/entities/organization-star-rating/' + item.id + '/edit');
  }

  async deleteModal(item: OrganizationStarRating) {
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
            this.organizationStarRatingService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/organization-star-rating');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
