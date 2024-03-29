import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { EventComment } from './event-comment.model';
import { EventCommentService } from './event-comment.service';

@Component({
  selector: 'page-event-comment',
  templateUrl: 'event-comment.html',
})
export class EventCommentPage {
  eventComments: EventComment[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private eventCommentService: EventCommentService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.eventComments = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.eventCommentService
      .query()
      .pipe(
        filter((res: HttpResponse<EventComment[]>) => res.ok),
        map((res: HttpResponse<EventComment[]>) => res.body)
      )
      .subscribe(
        (response: EventComment[]) => {
          this.eventComments = response;
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

  trackId(index: number, item: EventComment) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/event-comment/new');
  }

  async edit(item: IonItemSliding, eventComment: EventComment) {
    await this.navController.navigateForward('/tabs/entities/event-comment/' + eventComment.id + '/edit');
    await item.close();
  }

  async delete(eventComment) {
    this.eventCommentService.delete(eventComment.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'EventComment deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(eventComment: EventComment) {
    await this.navController.navigateForward('/tabs/entities/event-comment/' + eventComment.id + '/view');
  }
}
