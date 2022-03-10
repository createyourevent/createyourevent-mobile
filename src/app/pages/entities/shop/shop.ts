import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { Shop } from './shop.model';
import { ShopService } from './shop.service';

@Component({
  selector: 'page-shop',
  templateUrl: 'shop.html',
})
export class ShopPage {
  shops: Shop[];

  // todo: add pagination

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private shopService: ShopService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.shops = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.shopService
      .query()
      .pipe(
        filter((res: HttpResponse<Shop[]>) => res.ok),
        map((res: HttpResponse<Shop[]>) => res.body)
      )
      .subscribe(
        (response: Shop[]) => {
          this.shops = response;
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

  trackId(index: number, item: Shop) {
    return item.id;
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/shop/new');
  }

  async edit(item: IonItemSliding, shop: Shop) {
    await this.navController.navigateForward('/tabs/entities/shop/' + shop.id + '/edit');
    await item.close();
  }

  async delete(shop) {
    this.shopService.delete(shop.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Shop deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(shop: Shop) {
    await this.navController.navigateForward('/tabs/entities/shop/' + shop.id + '/view');
  }
}
