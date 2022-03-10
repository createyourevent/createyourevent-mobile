import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { DeliveryType } from './delivery-type.model';
import { DeliveryTypeService } from './delivery-type.service';

@Component({
  selector: 'page-delivery-type',
  templateUrl: 'delivery-type.html',
})
export class DeliveryTypePage {
  deliveryTypes: DeliveryType[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private deliveryTypeService: DeliveryTypeService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.deliveryTypes = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.deliveryTypeService
      .query()
      .pipe(
        filter((res: HttpResponse<DeliveryType[]>) => res.ok),
        map((res: HttpResponse<DeliveryType[]>) => res.body)
      )
      .subscribe(
        (response: DeliveryType[]) => {
          this.deliveryTypes = response;
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

  trackId(index: number, item: DeliveryType) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/delivery-type/new');
  }

  async edit(item: IonItemSliding, deliveryType: DeliveryType) {
    await this.navController.navigateForward('/tabs/entities/delivery-type/' + deliveryType.id + '/edit');
    await item.close();
  }

  async delete(deliveryType) {
    this.deliveryTypeService.delete(deliveryType.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'DeliveryType deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(deliveryType: DeliveryType) {
    await this.navController.navigateForward('/tabs/entities/delivery-type/' + deliveryType.id + '/view');
  }
}
