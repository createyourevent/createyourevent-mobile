import { User } from './../../services/user/user.model';
import { GeneralService } from 'src/app/general.service';
import { Component, OnInit } from '@angular/core';
import { Coupon } from '../entities/coupon';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { Account } from 'src/model/account.model';
import { AccountService } from 'src/app/services/auth/account.service';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.page.html',
  styleUrls: ['./coupons.page.scss'],
})
export class CouponsPage implements OnInit {

  coupons: Coupon[] = [];
  slideOpts: any;
  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  account: any;

  constructor(private generalService: GeneralService, private accountService: AccountService,) { }

    ngOnInit() {
    this.accountService.identity().then((account) => {
      if (account === null) {
      } else {
        this.account = account;
        this.generalService.findCouponsByUser(this.account.id).subscribe(res => {
          const c = res.body;
          c.forEach(el => {
            if(el.used === null || el.used === false) {
              this.coupons.push(el);
            }
          });
        });
      }
      });

    this.slideOpts = {
      initialSlide: 1,
      speed: 400
    };
  }

  getValue(coupon): string {
      return coupon.user.id + ',,,' + coupon.id + ',,,' + coupon.couponNr + ',,,' + coupon.user.email;
  }

}
