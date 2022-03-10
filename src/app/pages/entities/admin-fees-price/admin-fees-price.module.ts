import { NgModule, Injectable } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserRouteAccessService } from '../../../services/auth/user-route-access.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';

import { AdminFeesPricePage } from './admin-fees-price';
import { AdminFeesPriceUpdatePage } from './admin-fees-price-update';
import { AdminFeesPrice, AdminFeesPriceService, AdminFeesPriceDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class AdminFeesPriceResolve implements Resolve<AdminFeesPrice> {
  constructor(private service: AdminFeesPriceService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AdminFeesPrice> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<AdminFeesPrice>) => response.ok),
        map((adminFeesPrice: HttpResponse<AdminFeesPrice>) => adminFeesPrice.body)
      );
    }
    return of(new AdminFeesPrice());
  }
}

const routes: Routes = [
  {
    path: '',
    component: AdminFeesPricePage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AdminFeesPriceUpdatePage,
    resolve: {
      data: AdminFeesPriceResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AdminFeesPriceDetailPage,
    resolve: {
      data: AdminFeesPriceResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AdminFeesPriceUpdatePage,
    resolve: {
      data: AdminFeesPriceResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [AdminFeesPricePage, AdminFeesPriceUpdatePage, AdminFeesPriceDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class AdminFeesPricePageModule {}
