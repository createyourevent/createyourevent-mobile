import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { ProductLikeDislike } from './product-like-dislike.model';
import { ProductLikeDislikeService } from './product-like-dislike.service';

@Component({
  selector: 'page-product-like-dislike',
  templateUrl: 'product-like-dislike.html',
})
export class ProductLikeDislikePage {
  productLikeDislikes: ProductLikeDislike[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private productLikeDislikeService: ProductLikeDislikeService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.productLikeDislikes = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.productLikeDislikeService
      .query()
      .pipe(
        filter((res: HttpResponse<ProductLikeDislike[]>) => res.ok),
        map((res: HttpResponse<ProductLikeDislike[]>) => res.body)
      )
      .subscribe(
        (response: ProductLikeDislike[]) => {
          this.productLikeDislikes = response;
          if (typeof refresher !== 'undefined') {
            setTimeout(() => {
              refresher.target.complete();
            }, 750);
          }
        },
        async (error) => {
          console.error(error);
          const toast = await this.toastCtrl.create({ message: 'Failed to load data', duration: 2000, position: 'middle' });
          await toast.present();
        }
      );
  }

  trackId(index: number, item: ProductLikeDislike) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/product-like-dislike/new');
  }

  async edit(item: IonItemSliding, productLikeDislike: ProductLikeDislike) {
    await this.navController.navigateForward('/tabs/entities/product-like-dislike/' + productLikeDislike.id + '/edit');
    await item.close();
  }

  async delete(productLikeDislike) {
    this.productLikeDislikeService.delete(productLikeDislike.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({
          message: 'ProductLikeDislike deleted successfully.',
          duration: 3000,
          position: 'middle',
        });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(productLikeDislike: ProductLikeDislike) {
    await this.navController.navigateForward('/tabs/entities/product-like-dislike/' + productLikeDislike.id + '/view');
  }
}
