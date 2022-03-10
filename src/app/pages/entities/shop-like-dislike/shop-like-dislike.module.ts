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

import { ShopLikeDislikePage } from './shop-like-dislike';
import { ShopLikeDislikeUpdatePage } from './shop-like-dislike-update';
import { ShopLikeDislike, ShopLikeDislikeService, ShopLikeDislikeDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class ShopLikeDislikeResolve implements Resolve<ShopLikeDislike> {
  constructor(private service: ShopLikeDislikeService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ShopLikeDislike> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<ShopLikeDislike>) => response.ok),
        map((shopLikeDislike: HttpResponse<ShopLikeDislike>) => shopLikeDislike.body)
      );
    }
    return of(new ShopLikeDislike());
  }
}

const routes: Routes = [
  {
    path: '',
    component: ShopLikeDislikePage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ShopLikeDislikeUpdatePage,
    resolve: {
      data: ShopLikeDislikeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ShopLikeDislikeDetailPage,
    resolve: {
      data: ShopLikeDislikeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ShopLikeDislikeUpdatePage,
    resolve: {
      data: ShopLikeDislikeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [ShopLikeDislikePage, ShopLikeDislikeUpdatePage, ShopLikeDislikeDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class ShopLikeDislikePageModule {}
