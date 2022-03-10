import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { Gift } from './gift.model';
import { GiftService } from './gift.service';

@Component({
  selector: 'page-gift',
  templateUrl: 'gift.html',
})
export class GiftPage {
  gifts: Gift[];

  // todo: add pagination

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private giftService: GiftService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.gifts = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.giftService
      .query()
      .pipe(
        filter((res: HttpResponse<Gift[]>) => res.ok),
        map((res: HttpResponse<Gift[]>) => res.body)
      )
      .subscribe(
        (response: Gift[]) => {
          this.gifts = response;
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

  trackId(index: number, item: Gift) {
    return item.id;
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/gift/new');
  }

  async edit(item: IonItemSliding, gift: Gift) {
    await this.navController.navigateForward('/tabs/entities/gift/' + gift.id + '/edit');
    await item.close();
  }

  async delete(gift) {
    this.giftService.delete(gift.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Gift deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(gift: Gift) {
    await this.navController.navigateForward('/tabs/entities/gift/' + gift.id + '/view');
  }
}
