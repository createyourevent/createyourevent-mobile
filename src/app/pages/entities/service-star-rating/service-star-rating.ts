import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { ServiceStarRating } from './service-star-rating.model';
import { ServiceStarRatingService } from './service-star-rating.service';

@Component({
  selector: 'page-service-star-rating',
  templateUrl: 'service-star-rating.html',
})
export class ServiceStarRatingPage {
  serviceStarRatings: ServiceStarRating[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private serviceStarRatingService: ServiceStarRatingService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.serviceStarRatings = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.serviceStarRatingService
      .query()
      .pipe(
        filter((res: HttpResponse<ServiceStarRating[]>) => res.ok),
        map((res: HttpResponse<ServiceStarRating[]>) => res.body)
      )
      .subscribe(
        (response: ServiceStarRating[]) => {
          this.serviceStarRatings = response;
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

  trackId(index: number, item: ServiceStarRating) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/service-star-rating/new');
  }

  async edit(item: IonItemSliding, serviceStarRating: ServiceStarRating) {
    await this.navController.navigateForward('/tabs/entities/service-star-rating/' + serviceStarRating.id + '/edit');
    await item.close();
  }

  async delete(serviceStarRating) {
    this.serviceStarRatingService.delete(serviceStarRating.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({
          message: 'ServiceStarRating deleted successfully.',
          duration: 3000,
          position: 'middle',
        });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(serviceStarRating: ServiceStarRating) {
    await this.navController.navigateForward('/tabs/entities/service-star-rating/' + serviceStarRating.id + '/view');
  }
}
