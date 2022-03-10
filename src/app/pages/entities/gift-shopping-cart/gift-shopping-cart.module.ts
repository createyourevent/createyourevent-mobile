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

import { GiftShoppingCartPage } from './gift-shopping-cart';
import { GiftShoppingCartUpdatePage } from './gift-shopping-cart-update';
import { GiftShoppingCart, GiftShoppingCartService, GiftShoppingCartDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class GiftShoppingCartResolve implements Resolve<GiftShoppingCart> {
  constructor(private service: GiftShoppingCartService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<GiftShoppingCart> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<GiftShoppingCart>) => response.ok),
        map((giftShoppingCart: HttpResponse<GiftShoppingCart>) => giftShoppingCart.body)
      );
    }
    return of(new GiftShoppingCart());
  }
}

const routes: Routes = [
  {
    path: '',
    component: GiftShoppingCartPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GiftShoppingCartUpdatePage,
    resolve: {
      data: GiftShoppingCartResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GiftShoppingCartDetailPage,
    resolve: {
      data: GiftShoppingCartResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GiftShoppingCartUpdatePage,
    resolve: {
      data: GiftShoppingCartResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [GiftShoppingCartPage, GiftShoppingCartUpdatePage, GiftShoppingCartDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class GiftShoppingCartPageModule {}
