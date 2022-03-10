import { Component, OnInit } from '@angular/core';
import { ProductStarRating } from './product-star-rating.model';
import { ProductStarRatingService } from './product-star-rating.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-product-star-rating-detail',
  templateUrl: 'product-star-rating-detail.html',
})
export class ProductStarRatingDetailPage implements OnInit {
  productStarRating: ProductStarRating = {};

  constructor(
    private navController: NavController,
    private productStarRatingService: ProductStarRatingService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.productStarRating = response.data;
    });
  }

  open(item: ProductStarRating) {
    this.navController.navigateForward('/tabs/entities/product-star-rating/' + item.id + '/edit');
  }

  async deleteModal(item: ProductStarRating) {
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
            this.productStarRatingService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/product-star-rating');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
