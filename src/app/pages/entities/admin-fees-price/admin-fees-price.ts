import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { AdminFeesPrice } from './admin-fees-price.model';
import { AdminFeesPriceService } from './admin-fees-price.service';

@Component({
  selector: 'page-admin-fees-price',
  templateUrl: 'admin-fees-price.html',
})
export class AdminFeesPricePage {
  adminFeesPrices: AdminFeesPrice[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private adminFeesPriceService: AdminFeesPriceService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.adminFeesPrices = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.adminFeesPriceService
      .query()
      .pipe(
        filter((res: HttpResponse<AdminFeesPrice[]>) => res.ok),
        map((res: HttpResponse<AdminFeesPrice[]>) => res.body)
      )
      .subscribe(
        (response: AdminFeesPrice[]) => {
          this.adminFeesPrices = response;
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

  trackId(index: number, item: AdminFeesPrice) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/admin-fees-price/new');
  }

  async edit(item: IonItemSliding, adminFeesPrice: AdminFeesPrice) {
    await this.navController.navigateForward('/tabs/entities/admin-fees-price/' + adminFeesPrice.id + '/edit');
    await item.close();
  }

  async delete(adminFeesPrice) {
    this.adminFeesPriceService.delete(adminFeesPrice.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'AdminFeesPrice deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(adminFeesPrice: AdminFeesPrice) {
    await this.navController.navigateForward('/tabs/entities/admin-fees-price/' + adminFeesPrice.id + '/view');
  }
}
