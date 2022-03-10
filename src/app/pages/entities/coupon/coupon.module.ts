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

import { CouponPage } from './coupon';
import { CouponUpdatePage } from './coupon-update';
import { Coupon, CouponService, CouponDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class CouponResolve implements Resolve<Coupon> {
  constructor(private service: CouponService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Coupon> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Coupon>) => response.ok),
        map((coupon: HttpResponse<Coupon>) => coupon.body)
      );
    }
    return of(new Coupon());
  }
}

const routes: Routes = [
  {
    path: '',
    component: CouponPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CouponUpdatePage,
    resolve: {
      data: CouponResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CouponDetailPage,
    resolve: {
      data: CouponResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CouponUpdatePage,
    resolve: {
      data: CouponResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [CouponPage, CouponUpdatePage, CouponDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class CouponPageModule {}
