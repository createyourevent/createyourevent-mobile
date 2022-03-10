import { IUser } from './../../shared/model/user.model';
import { CouponService } from './../entities/coupon/coupon.service';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ZBar } from '@ionic-native/zbar/ngx';
import { NavController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Coupon } from '../entities/coupon';
import { AccountService } from 'src/app/services/auth/account.service';
import { Event, EventService } from '../entities/event';
import { GeneralService } from 'src/app/general.service';

@Component({
  selector: 'app-couponscanner',
  templateUrl: './couponscanner.page.html',
  styleUrls: ['./couponscanner.page.scss'],
  providers: [ZBar]
})
export class CouponscannerPage implements OnInit {

  optionZbar: any;
  scannedOutput: any;
  couponId: number;
  couponNr: string;
  coupon: Coupon;
  events: Event[];
  event: Event = null;
  user: IUser;
  checkEventId: number;
  value: number;
  isDisable = true;

  constructor(private zbarPlugin: ZBar,
              public toastController: ToastController,
              private generalService: GeneralService,
              private eventService: EventService,
              private translate: TranslateService,
              private datePipe: DatePipe,
              private couponService: CouponService,
              private accountService: AccountService,
              public navController: NavController,) { }

  ngOnInit() {
    this.accountService.identity().then((account) => {
      if (account === null) {
        this.goBackToHomePage();
      } else {
        this.generalService.findWidthAuthorities().subscribe((u) => {
          this.user = u.body;
          this.generalService.findEventsByUserId(account.id).subscribe((es) => {
            this.events = es.body;
          });
        });
      }
    });
  }

  onChangeVal(e: any) {
    this.isDisable = false;
  }

  onChange(e: any) {
    this.checkEventId = Number(e.target.value);
    this.eventService.find(this.checkEventId).subscribe(res => {
      this.event = res.body;
    });
    // this.sync();
  }

  goBackToHomePage(): void {
    this.navController.navigateRoot('');
  }

  barcodeScanner() {
    this.zbarPlugin
      .scan(this.optionZbar)
      .then((respone) => {
        let infoArr: string[] = [];
        this.scannedOutput = respone;
        infoArr = this.scannedOutput.split(',,,');
        this.couponId = Number(infoArr[1]);
        this.couponNr = infoArr[2];

        this.couponService.find(this.couponId).subscribe((res) => {
          this.coupon = res.body;
          if (!this.coupon) {
            this.noCouponFound();
          } else if(this.coupon.value - this.value < 0) {
            this.notEnoughtMoney();
          } else if(this.coupon.used){
            this.couponUsed();
          } else {
            this.coupon.value -= this.value;
            this.coupon.event = this.event;
            if(this.coupon.value - this.value === 0) {
              this.coupon.used = true;
            }
            this.couponService.update(this.coupon).subscribe(() => {
              this.couponValid();
            });
          }
        });
      })
      .catch((error) => {
        alert(error);
      });
  }

  async notEnoughtMoney() {
    const toast = await this.toastController.create({
      message: 'Not enought money.',
      duration: 4000,
      color: 'warning',
    });
    toast.present();
  }

  async noCouponFound() {
    const toast = await this.toastController.create({
      message: 'No coupon found with this id and couponNr.',
      duration: 4000,
      color: 'warning',
    });
    toast.present();
  }

  async couponUsed() {
    const toast = await this.toastController.create({
      message: 'This coupon has already been redeemed.',
      duration: 4000,
      color: 'warning',
    });
    toast.present();
  }

  async couponValid() {
    const toast = await this.toastController.create({
      message: 'Coupon redeemed successfully.',
      duration: 4000,
      color: 'success',
    });
    toast.present();
  }



}
