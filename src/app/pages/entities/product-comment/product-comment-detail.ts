import { Component, OnInit } from '@angular/core';
import { ProductComment } from './product-comment.model';
import { ProductCommentService } from './product-comment.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-product-comment-detail',
  templateUrl: 'product-comment-detail.html',
})
export class ProductCommentDetailPage implements OnInit {
  productComment: ProductComment = {};

  constructor(
    private navController: NavController,
    private productCommentService: ProductCommentService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.productComment = response.data;
    });
  }

  open(item: ProductComment) {
    this.navController.navigateForward('/tabs/entities/product-comment/' + item.id + '/edit');
  }

  async deleteModal(item: ProductComment) {
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
            this.productCommentService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/product-comment');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
