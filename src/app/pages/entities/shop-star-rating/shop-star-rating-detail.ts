import { Component, OnInit } from '@angular/core';
import { ShopStarRating } from './shop-star-rating.model';
import { ShopStarRatingService } from './shop-star-rating.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-shop-star-rating-detail',
  templateUrl: 'shop-star-rating-detail.html',
})
export class ShopStarRatingDetailPage implements OnInit {
  shopStarRating: ShopStarRating = {};

  constructor(
    private navController: NavController,
    private shopStarRatingService: ShopStarRatingService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.shopStarRating = response.data;
    });
  }

  open(item: ShopStarRating) {
    this.navController.navigateForward('/tabs/entities/shop-star-rating/' + item.id + '/edit');
  }

  async deleteModal(item: ShopStarRating) {
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
            this.shopStarRatingService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/shop-star-rating');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
