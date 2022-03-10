import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { EventProductOrder } from './event-product-order.model';
import { EventProductOrderService } from './event-product-order.service';

@Component({
  selector: 'page-event-product-order',
  templateUrl: 'event-product-order.html',
})
export class EventProductOrderPage {
  eventProductOrders: EventProductOrder[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private eventProductOrderService: EventProductOrderService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.eventProductOrders = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.eventProductOrderService
      .query()
      .pipe(
        filter((res: HttpResponse<EventProductOrder[]>) => res.ok),
        map((res: HttpResponse<EventProductOrder[]>) => res.body)
      )
      .subscribe(
        (response: EventProductOrder[]) => {
          this.eventProductOrders = response;
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

  trackId(index: number, item: EventProductOrder) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/event-product-order/new');
  }

  async edit(item: IonItemSliding, eventProductOrder: EventProductOrder) {
    await this.navController.navigateForward('/tabs/entities/event-product-order/' + eventProductOrder.id + '/edit');
    await item.close();
  }

  async delete(eventProductOrder) {
    this.eventProductOrderService.delete(eventProductOrder.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({
          message: 'EventProductOrder deleted successfully.',
          duration: 3000,
          position: 'middle',
        });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(eventProductOrder: EventProductOrder) {
    await this.navController.navigateForward('/tabs/entities/event-product-order/' + eventProductOrder.id + '/view');
  }
}
