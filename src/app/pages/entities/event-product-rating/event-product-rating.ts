import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { EventProductRating } from './event-product-rating.model';
import { EventProductRatingService } from './event-product-rating.service';

@Component({
  selector: 'page-event-product-rating',
  templateUrl: 'event-product-rating.html',
})
export class EventProductRatingPage {
  eventProductRatings: EventProductRating[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private eventProductRatingService: EventProductRatingService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.eventProductRatings = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.eventProductRatingService
      .query()
      .pipe(
        filter((res: HttpResponse<EventProductRating[]>) => res.ok),
        map((res: HttpResponse<EventProductRating[]>) => res.body)
      )
      .subscribe(
        (response: EventProductRating[]) => {
          this.eventProductRatings = response;
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

  trackId(index: number, item: EventProductRating) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/event-product-rating/new');
  }

  async edit(item: IonItemSliding, eventProductRating: EventProductRating) {
    await this.navController.navigateForward('/tabs/entities/event-product-rating/' + eventProductRating.id + '/edit');
    await item.close();
  }

  async delete(eventProductRating) {
    this.eventProductRatingService.delete(eventProductRating.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({
          message: 'EventProductRating deleted successfully.',
          duration: 3000,
          position: 'middle',
        });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(eventProductRating: EventProductRating) {
    await this.navController.navigateForward('/tabs/entities/event-product-rating/' + eventProductRating.id + '/view');
  }
}
