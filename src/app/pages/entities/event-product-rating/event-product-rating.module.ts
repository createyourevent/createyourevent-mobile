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

import { EventProductRatingPage } from './event-product-rating';
import { EventProductRatingUpdatePage } from './event-product-rating-update';
import { EventProductRating, EventProductRatingService, EventProductRatingDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class EventProductRatingResolve implements Resolve<EventProductRating> {
  constructor(private service: EventProductRatingService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<EventProductRating> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<EventProductRating>) => response.ok),
        map((eventProductRating: HttpResponse<EventProductRating>) => eventProductRating.body)
      );
    }
    return of(new EventProductRating());
  }
}

const routes: Routes = [
  {
    path: '',
    component: EventProductRatingPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EventProductRatingUpdatePage,
    resolve: {
      data: EventProductRatingResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EventProductRatingDetailPage,
    resolve: {
      data: EventProductRatingResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EventProductRatingUpdatePage,
    resolve: {
      data: EventProductRatingResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [EventProductRatingPage, EventProductRatingUpdatePage, EventProductRatingDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class EventProductRatingPageModule {}
