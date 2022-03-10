import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouteReuseStrategy, RouterModule, Routes } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { UserRouteAccessService } from 'src/app/services/auth/user-route-access.service';
import { ScannerPage } from './scanner.page';
import { ZBar } from '@ionic-native/zbar/ngx';
import { DatePipe } from '@angular/common';
import { SQLite } from '@ionic-native/sqlite/ngx';

const routes: Routes = [
  {
    path: '',
    component: ScannerPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule, RouterModule.forChild(routes)],
  providers: [ZBar, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, DatePipe],
  declarations: [ScannerPage],
})
export class ScannerPageModule {}
