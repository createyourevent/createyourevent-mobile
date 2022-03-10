import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { UserRouteAccessService } from 'src/app/services/auth/user-route-access.service';
import { TicketsPage } from './tickets.page';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { TicketBarcodePage } from './barcode.page';

const routes: Routes = [
  {
    path: '',
    component: TicketsPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'barcode',
    component: TicketBarcodePage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule, RouterModule.forChild(routes), CommonModule, NgxQRCodeModule],
  declarations: [TicketsPage, TicketBarcodePage],
})
export class TicketsPageModule {}
