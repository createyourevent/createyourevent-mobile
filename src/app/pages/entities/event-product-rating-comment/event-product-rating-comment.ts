import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { EventProductRatingComment } from './event-product-rating-comment.model';
import { EventProductRatingCommentService } from './event-product-rating-comment.service';

@Component({
  selector: 'page-event-product-rating-comment',
  templateUrl: 'event-product-rating-comment.html',
})
export class EventProductRatingCommentPage {
  eventProductRatingComments: EventProductRatingComment[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private eventProductRatingCommentService: EventProductRatingCommentService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.eventProductRatingComments = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.eventProductRatingCommentService
      .query()
      .pipe(
        filter((res: HttpResponse<EventProductRatingComment[]>) => res.ok),
        map((res: HttpResponse<EventProductRatingComment[]>) => res.body)
      )
      .subscribe(
        (response: EventProductRatingComment[]) => {
          this.eventProductRatingComments = response;
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

  trackId(index: number, item: EventProductRatingComment) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/event-product-rating-comment/new');
  }

  async edit(item: IonItemSliding, eventProductRatingComment: EventProductRatingComment) {
    await this.navController.navigateForward('/tabs/entities/event-product-rating-comment/' + eventProductRatingComment.id + '/edit');
    await item.close();
  }

  async delete(eventProductRatingComment) {
    this.eventProductRatingCommentService.delete(eventProductRatingComment.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({
          message: 'EventProductRatingComment deleted successfully.',
          duration: 3000,
          position: 'middle',
        });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(eventProductRatingComment: EventProductRatingComment) {
    await this.navController.navigateForward('/tabs/entities/event-product-rating-comment/' + eventProductRatingComment.id + '/view');
  }
}
