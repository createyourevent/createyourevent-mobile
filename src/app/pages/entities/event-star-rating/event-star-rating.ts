import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { EventStarRating } from './event-star-rating.model';
import { EventStarRatingService } from './event-star-rating.service';

@Component({
  selector: 'page-event-star-rating',
  templateUrl: 'event-star-rating.html',
})
export class EventStarRatingPage {
  eventStarRatings: EventStarRating[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private eventStarRatingService: EventStarRatingService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.eventStarRatings = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.eventStarRatingService
      .query()
      .pipe(
        filter((res: HttpResponse<EventStarRating[]>) => res.ok),
        map((res: HttpResponse<EventStarRating[]>) => res.body)
      )
      .subscribe(
        (response: EventStarRating[]) => {
          this.eventStarRatings = response;
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

  trackId(index: number, item: EventStarRating) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/event-star-rating/new');
  }

  async edit(item: IonItemSliding, eventStarRating: EventStarRating) {
    await this.navController.navigateForward('/tabs/entities/event-star-rating/' + eventStarRating.id + '/edit');
    await item.close();
  }

  async delete(eventStarRating) {
    this.eventStarRatingService.delete(eventStarRating.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'EventStarRating deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(eventStarRating: EventStarRating) {
    await this.navController.navigateForward('/tabs/entities/event-star-rating/' + eventStarRating.id + '/view');
  }
}
