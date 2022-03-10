import { Component, OnInit } from '@angular/core';
import { ShopLikeDislike } from './shop-like-dislike.model';
import { ShopLikeDislikeService } from './shop-like-dislike.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-shop-like-dislike-detail',
  templateUrl: 'shop-like-dislike-detail.html',
})
export class ShopLikeDislikeDetailPage implements OnInit {
  shopLikeDislike: ShopLikeDislike = {};

  constructor(
    private navController: NavController,
    private shopLikeDislikeService: ShopLikeDislikeService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.shopLikeDislike = response.data;
    });
  }

  open(item: ShopLikeDislike) {
    this.navController.navigateForward('/tabs/entities/shop-like-dislike/' + item.id + '/edit');
  }

  async deleteModal(item: ShopLikeDislike) {
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
            this.shopLikeDislikeService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/shop-like-dislike');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
