import { NgModule, Injectable } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { Camera } from '@ionic-native/camera/ngx';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserRouteAccessService } from '../../../services/auth/user-route-access.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';

import { ShopPage } from './shop';
import { ShopUpdatePage } from './shop-update';
import { Shop, ShopService, ShopDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class ShopResolve implements Resolve<Shop> {
  constructor(private service: ShopService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Shop> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Shop>) => response.ok),
        map((shop: HttpResponse<Shop>) => shop.body)
      );
    }
    return of(new Shop());
  }
}

const routes: Routes = [
  {
    path: '',
    component: ShopPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ShopUpdatePage,
    resolve: {
      data: ShopResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ShopDetailPage,
    resolve: {
      data: ShopResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ShopUpdatePage,
    resolve: {
      data: ShopResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [ShopPage, ShopUpdatePage, ShopDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
  providers: [Camera],
})
export class ShopPageModule {}
