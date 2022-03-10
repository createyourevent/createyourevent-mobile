import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { Coupon } from './coupon.model';
import { CouponService } from './coupon.service';

@Component({
  selector: 'page-coupon',
  templateUrl: 'coupon.html',
})
export class CouponPage {
  coupons: Coupon[];

  // todo: add pagination

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private couponService: CouponService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.coupons = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.couponService
      .query()
      .pipe(
        filter((res: HttpResponse<Coupon[]>) => res.ok),
        map((res: HttpResponse<Coupon[]>) => res.body)
      )
      .subscribe(
        (response: Coupon[]) => {
          this.coupons = response;
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

  trackId(index: number, item: Coupon) {
    return item.id;
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/coupon/new');
  }

  async edit(item: IonItemSliding, coupon: Coupon) {
    await this.navController.navigateForward('/tabs/entities/coupon/' + coupon.id + '/edit');
    await item.close();
  }

  async delete(coupon) {
    this.couponService.delete(coupon.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Coupon deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  async view(coupon: Coupon) {
    await this.navController.navigateForward('/tabs/entities/coupon/' + coupon.id + '/view');
  }
}
