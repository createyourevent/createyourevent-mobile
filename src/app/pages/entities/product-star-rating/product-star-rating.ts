import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { ProductStarRating } from './product-star-rating.model';
import { ProductStarRatingService } from './product-star-rating.service';

@Component({
  selector: 'page-product-star-rating',
  templateUrl: 'product-star-rating.html',
})
export class ProductStarRatingPage {
  productStarRatings: ProductStarRating[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private productStarRatingService: ProductStarRatingService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.productStarRatings = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.productStarRatingService
      .query()
      .pipe(
        filter((res: HttpResponse<ProductStarRating[]>) => res.ok),
        map((res: HttpResponse<ProductStarRating[]>) => res.body)
      )
      .subscribe(
        (response: ProductStarRating[]) => {
          this.productStarRatings = response;
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

  trackId(index: number, item: ProductStarRating) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/product-star-rating/new');
  }

  async edit(item: IonItemSliding, productStarRating: ProductStarRating) {
    await this.navController.navigateForward('/tabs/entities/product-star-rating/' + productStarRating.id + '/edit');
    await item.close();
  }

  async delete(productStarRating) {
    this.productStarRatingService.delete(productStarRating.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({
          message: 'ProductStarRating deleted successfully.',
          duration: 3000,
          position: 'middle',
        });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(productStarRating: ProductStarRating) {
    await this.navController.navigateForward('/tabs/entities/product-star-rating/' + productStarRating.id + '/view');
  }
}
