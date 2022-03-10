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

import { ProductLikeDislikePage } from './product-like-dislike';
import { ProductLikeDislikeUpdatePage } from './product-like-dislike-update';
import { ProductLikeDislike, ProductLikeDislikeService, ProductLikeDislikeDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class ProductLikeDislikeResolve implements Resolve<ProductLikeDislike> {
  constructor(private service: ProductLikeDislikeService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ProductLikeDislike> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<ProductLikeDislike>) => response.ok),
        map((productLikeDislike: HttpResponse<ProductLikeDislike>) => productLikeDislike.body)
      );
    }
    return of(new ProductLikeDislike());
  }
}

const routes: Routes = [
  {
    path: '',
    component: ProductLikeDislikePage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProductLikeDislikeUpdatePage,
    resolve: {
      data: ProductLikeDislikeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProductLikeDislikeDetailPage,
    resolve: {
      data: ProductLikeDislikeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProductLikeDislikeUpdatePage,
    resolve: {
      data: ProductLikeDislikeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [ProductLikeDislikePage, ProductLikeDislikeUpdatePage, ProductLikeDislikeDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class ProductLikeDislikePageModule {}
