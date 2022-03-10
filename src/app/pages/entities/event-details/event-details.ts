import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { EventDetails } from './event-details.model';
import { EventDetailsService } from './event-details.service';

@Component({
  selector: 'page-event-details',
  templateUrl: 'event-details.html',
})
export class EventDetailsPage {
  eventDetails: EventDetails[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private eventDetailsService: EventDetailsService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.eventDetails = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.eventDetailsService
      .query()
      .pipe(
        filter((res: HttpResponse<EventDetails[]>) => res.ok),
        map((res: HttpResponse<EventDetails[]>) => res.body)
      )
      .subscribe(
        (response: EventDetails[]) => {
          this.eventDetails = response;
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

  trackId(index: number, item: EventDetails) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/event-details/new');
  }

  async edit(item: IonItemSliding, eventDetails: EventDetails) {
    await this.navController.navigateForward('/tabs/entities/event-details/' + eventDetails.id + '/edit');
    await item.close();
  }

  async delete(eventDetails) {
    this.eventDetailsService.delete(eventDetails.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'EventDetails deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(eventDetails: EventDetails) {
    await this.navController.navigateForward('/tabs/entities/event-details/' + eventDetails.id + '/view');
  }
}
