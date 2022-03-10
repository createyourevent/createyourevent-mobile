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

import { CartPage } from './cart';
import { CartUpdatePage } from './cart-update';
import { Cart, CartService, CartDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class CartResolve implements Resolve<Cart> {
  constructor(private service: CartService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Cart> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Cart>) => response.ok),
        map((cart: HttpResponse<Cart>) => cart.body)
      );
    }
    return of(new Cart());
  }
}

const routes: Routes = [
  {
    path: '',
    component: CartPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CartUpdatePage,
    resolve: {
      data: CartResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CartDetailPage,
    resolve: {
      data: CartResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CartUpdatePage,
    resolve: {
      data: CartResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [CartPage, CartUpdatePage, CartDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class CartPageModule {}
