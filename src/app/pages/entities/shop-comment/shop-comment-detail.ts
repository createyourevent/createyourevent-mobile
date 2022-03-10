import { Component, OnInit } from '@angular/core';
import { ShopComment } from './shop-comment.model';
import { ShopCommentService } from './shop-comment.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-shop-comment-detail',
  templateUrl: 'shop-comment-detail.html',
})
export class ShopCommentDetailPage implements OnInit {
  shopComment: ShopComment = {};

  constructor(
    private navController: NavController,
    private shopCommentService: ShopCommentService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.shopComment = response.data;
    });
  }

  open(item: ShopComment) {
    this.navController.navigateForward('/tabs/entities/shop-comment/' + item.id + '/edit');
  }

  async deleteModal(item: ShopComment) {
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
            this.shopCommentService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/shop-comment');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
