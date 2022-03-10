import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { ShopLikeDislike } from './shop-like-dislike.model';
import { ShopLikeDislikeService } from './shop-like-dislike.service';

@Component({
  selector: 'page-shop-like-dislike',
  templateUrl: 'shop-like-dislike.html',
})
export class ShopLikeDislikePage {
  shopLikeDislikes: ShopLikeDislike[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private shopLikeDislikeService: ShopLikeDislikeService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.shopLikeDislikes = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.shopLikeDislikeService
      .query()
      .pipe(
        filter((res: HttpResponse<ShopLikeDislike[]>) => res.ok),
        map((res: HttpResponse<ShopLikeDislike[]>) => res.body)
      )
      .subscribe(
        (response: ShopLikeDislike[]) => {
          this.shopLikeDislikes = response;
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

  trackId(index: number, item: ShopLikeDislike) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/shop-like-dislike/new');
  }

  async edit(item: IonItemSliding, shopLikeDislike: ShopLikeDislike) {
    await this.navController.navigateForward('/tabs/entities/shop-like-dislike/' + shopLikeDislike.id + '/edit');
    await item.close();
  }

  async delete(shopLikeDislike) {
    this.shopLikeDislikeService.delete(shopLikeDislike.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'ShopLikeDislike deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(shopLikeDislike: ShopLikeDislike) {
    await this.navController.navigateForward('/tabs/entities/shop-like-dislike/' + shopLikeDislike.id + '/view');
  }
}
