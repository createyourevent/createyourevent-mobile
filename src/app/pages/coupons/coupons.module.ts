import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CouponsPageRoutingModule } from './coupons-routing.module';

import { CouponsPage } from './coupons.page';
import { TranslateModule } from '@ngx-translate/core';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CouponsPageRoutingModule,
    TranslateModule,
    NgxQRCodeModule
  ],
  declarations: [CouponsPage]
})
export class CouponsPageModule {}
