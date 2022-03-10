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

import { ShopStarRatingPage } from './shop-star-rating';
import { ShopStarRatingUpdatePage } from './shop-star-rating-update';
import { ShopStarRating, ShopStarRatingService, ShopStarRatingDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class ShopStarRatingResolve implements Resolve<ShopStarRating> {
  constructor(private service: ShopStarRatingService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ShopStarRating> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<ShopStarRating>) => response.ok),
        map((shopStarRating: HttpResponse<ShopStarRating>) => shopStarRating.body)
      );
    }
    return of(new ShopStarRating());
  }
}

const routes: Routes = [
  {
    path: '',
    component: ShopStarRatingPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ShopStarRatingUpdatePage,
    resolve: {
      data: ShopStarRatingResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ShopStarRatingDetailPage,
    resolve: {
      data: ShopStarRatingResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ShopStarRatingUpdatePage,
    resolve: {
      data: ShopStarRatingResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [ShopStarRatingPage, ShopStarRatingUpdatePage, ShopStarRatingDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class ShopStarRatingPageModule {}
