import { Component, OnInit } from '@angular/core';
import { JhiDataUtils } from 'src/app/services/utils/data-util.service';
import { Coupon } from './coupon.model';
import { CouponService } from './coupon.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-coupon-detail',
  templateUrl: 'coupon-detail.html',
})
export class CouponDetailPage implements OnInit {
  coupon: Coupon = {};

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private couponService: CouponService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.coupon = response.data;
    });
  }

  open(item: Coupon) {
    this.navController.navigateForward('/tabs/entities/coupon/' + item.id + '/edit');
  }

  async deleteModal(item: Coupon) {
    const alert = await this.alertController.create({
      header: 'Confirm the deletion?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Delete',
          handler: () => {
            this.couponService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/coupon');
            });
          },
        },
      ],
    });
    await alert.present();
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }
}
