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

import { ProductStarRatingPage } from './product-star-rating';
import { ProductStarRatingUpdatePage } from './product-star-rating-update';
import { ProductStarRating, ProductStarRatingService, ProductStarRatingDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class ProductStarRatingResolve implements Resolve<ProductStarRating> {
  constructor(private service: ProductStarRatingService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ProductStarRating> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<ProductStarRating>) => response.ok),
        map((productStarRating: HttpResponse<ProductStarRating>) => productStarRating.body)
      );
    }
    return of(new ProductStarRating());
  }
}

const routes: Routes = [
  {
    path: '',
    component: ProductStarRatingPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProductStarRatingUpdatePage,
    resolve: {
      data: ProductStarRatingResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProductStarRatingDetailPage,
    resolve: {
      data: ProductStarRatingResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProductStarRatingUpdatePage,
    resolve: {
      data: ProductStarRatingResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [ProductStarRatingPage, ProductStarRatingUpdatePage, ProductStarRatingDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class ProductStarRatingPageModule {}
