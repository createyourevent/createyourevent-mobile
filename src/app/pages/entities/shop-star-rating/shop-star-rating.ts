import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { ShopStarRating } from './shop-star-rating.model';
import { ShopStarRatingService } from './shop-star-rating.service';

@Component({
  selector: 'page-shop-star-rating',
  templateUrl: 'shop-star-rating.html',
})
export class ShopStarRatingPage {
  shopStarRatings: ShopStarRating[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private shopStarRatingService: ShopStarRatingService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.shopStarRatings = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.shopStarRatingService
      .query()
      .pipe(
        filter((res: HttpResponse<ShopStarRating[]>) => res.ok),
        map((res: HttpResponse<ShopStarRating[]>) => res.body)
      )
      .subscribe(
        (response: ShopStarRating[]) => {
          this.shopStarRatings = response;
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

  trackId(index: number, item: ShopStarRating) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/shop-star-rating/new');
  }

  async edit(item: IonItemSliding, shopStarRating: ShopStarRating) {
    await this.navController.navigateForward('/tabs/entities/shop-star-rating/' + shopStarRating.id + '/edit');
    await item.close();
  }

  async delete(shopStarRating) {
    this.shopStarRatingService.delete(shopStarRating.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'ShopStarRating deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(shopStarRating: ShopStarRating) {
    await this.navController.navigateForward('/tabs/entities/shop-star-rating/' + shopStarRating.id + '/view');
  }
}
