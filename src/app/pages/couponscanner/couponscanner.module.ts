import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { CouponscannerPageRoutingModule } from './couponscanner-routing.module';

import { CouponscannerPage } from './couponscanner.page';
import { TranslateModule } from '@ngx-translate/core';
import { ZBar } from '@ionic-native/zbar/ngx';
import { RouteReuseStrategy } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CouponscannerPageRoutingModule,
    TranslateModule,
  ],
  providers: [ZBar, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, DatePipe],
  declarations: [CouponscannerPage]
})
export class CouponscannerPageModule {}
