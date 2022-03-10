import { Component, OnInit } from '@angular/core';
import { ProductLikeDislike } from './product-like-dislike.model';
import { ProductLikeDislikeService } from './product-like-dislike.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-product-like-dislike-detail',
  templateUrl: 'product-like-dislike-detail.html',
})
export class ProductLikeDislikeDetailPage implements OnInit {
  productLikeDislike: ProductLikeDislike = {};

  constructor(
    private navController: NavController,
    private productLikeDislikeService: ProductLikeDislikeService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.productLikeDislike = response.data;
    });
  }

  open(item: ProductLikeDislike) {
    this.navController.navigateForward('/tabs/entities/product-like-dislike/' + item.id + '/edit');
  }

  async deleteModal(item: ProductLikeDislike) {
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
            this.productLikeDislikeService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/product-like-dislike');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
