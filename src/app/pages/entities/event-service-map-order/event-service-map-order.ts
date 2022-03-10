import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { EventServiceMapOrder } from './event-service-map-order.model';
import { EventServiceMapOrderService } from './event-service-map-order.service';

@Component({
  selector: 'page-event-service-map-order',
  templateUrl: 'event-service-map-order.html',
})
export class EventServiceMapOrderPage {
  eventServiceMapOrders: EventServiceMapOrder[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private eventServiceMapOrderService: EventServiceMapOrderService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.eventServiceMapOrders = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.eventServiceMapOrderService
      .query()
      .pipe(
        filter((res: HttpResponse<EventServiceMapOrder[]>) => res.ok),
        map((res: HttpResponse<EventServiceMapOrder[]>) => res.body)
      )
      .subscribe(
        (response: EventServiceMapOrder[]) => {
          this.eventServiceMapOrders = response;
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

  trackId(index: number, item: EventServiceMapOrder) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/event-service-map-order/new');
  }

  async edit(item: IonItemSliding, eventServiceMapOrder: EventServiceMapOrder) {
    await this.navController.navigateForward('/tabs/entities/event-service-map-order/' + eventServiceMapOrder.id + '/edit');
    await item.close();
  }

  async delete(eventServiceMapOrder) {
    this.eventServiceMapOrderService.delete(eventServiceMapOrder.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({
          message: 'EventServiceMapOrder deleted successfully.',
          duration: 3000,
          position: 'middle',
        });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(eventServiceMapOrder: EventServiceMapOrder) {
    await this.navController.navigateForward('/tabs/entities/event-service-map-order/' + eventServiceMapOrder.id + '/view');
  }
}
