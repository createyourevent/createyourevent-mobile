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

import { ServiceStarRatingPage } from './service-star-rating';
import { ServiceStarRatingUpdatePage } from './service-star-rating-update';
import { ServiceStarRating, ServiceStarRatingService, ServiceStarRatingDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class ServiceStarRatingResolve implements Resolve<ServiceStarRating> {
  constructor(private service: ServiceStarRatingService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ServiceStarRating> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<ServiceStarRating>) => response.ok),
        map((serviceStarRating: HttpResponse<ServiceStarRating>) => serviceStarRating.body)
      );
    }
    return of(new ServiceStarRating());
  }
}

const routes: Routes = [
  {
    path: '',
    component: ServiceStarRatingPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ServiceStarRatingUpdatePage,
    resolve: {
      data: ServiceStarRatingResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ServiceStarRatingDetailPage,
    resolve: {
      data: ServiceStarRatingResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ServiceStarRatingUpdatePage,
    resolve: {
      data: ServiceStarRatingResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [ServiceStarRatingPage, ServiceStarRatingUpdatePage, ServiceStarRatingDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class ServiceStarRatingPageModule {}
