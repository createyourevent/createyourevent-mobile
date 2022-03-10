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

import { EventStarRatingPage } from './event-star-rating';
import { EventStarRatingUpdatePage } from './event-star-rating-update';
import { EventStarRating, EventStarRatingService, EventStarRatingDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class EventStarRatingResolve implements Resolve<EventStarRating> {
  constructor(private service: EventStarRatingService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<EventStarRating> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<EventStarRating>) => response.ok),
        map((eventStarRating: HttpResponse<EventStarRating>) => eventStarRating.body)
      );
    }
    return of(new EventStarRating());
  }
}

const routes: Routes = [
  {
    path: '',
    component: EventStarRatingPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EventStarRatingUpdatePage,
    resolve: {
      data: EventStarRatingResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EventStarRatingDetailPage,
    resolve: {
      data: EventStarRatingResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EventStarRatingUpdatePage,
    resolve: {
      data: EventStarRatingResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [EventStarRatingPage, EventStarRatingUpdatePage, EventStarRatingDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class EventStarRatingPageModule {}
