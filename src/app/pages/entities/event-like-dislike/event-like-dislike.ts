import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { EventLikeDislike } from './event-like-dislike.model';
import { EventLikeDislikeService } from './event-like-dislike.service';

@Component({
  selector: 'page-event-like-dislike',
  templateUrl: 'event-like-dislike.html',
})
export class EventLikeDislikePage {
  eventLikeDislikes: EventLikeDislike[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private eventLikeDislikeService: EventLikeDislikeService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.eventLikeDislikes = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.eventLikeDislikeService
      .query()
      .pipe(
        filter((res: HttpResponse<EventLikeDislike[]>) => res.ok),
        map((res: HttpResponse<EventLikeDislike[]>) => res.body)
      )
      .subscribe(
        (response: EventLikeDislike[]) => {
          this.eventLikeDislikes = response;
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

  trackId(index: number, item: EventLikeDislike) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/event-like-dislike/new');
  }

  async edit(item: IonItemSliding, eventLikeDislike: EventLikeDislike) {
    await this.navController.navigateForward('/tabs/entities/event-like-dislike/' + eventLikeDislike.id + '/edit');
    await item.close();
  }

  async delete(eventLikeDislike) {
    this.eventLikeDislikeService.delete(eventLikeDislike.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({
          message: 'EventLikeDislike deleted successfully.',
          duration: 3000,
          position: 'middle',
        });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(eventLikeDislike: EventLikeDislike) {
    await this.navController.navigateForward('/tabs/entities/event-like-dislike/' + eventLikeDislike.id + '/view');
  }
}
