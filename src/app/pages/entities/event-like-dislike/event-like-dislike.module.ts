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

import { EventLikeDislikePage } from './event-like-dislike';
import { EventLikeDislikeUpdatePage } from './event-like-dislike-update';
import { EventLikeDislike, EventLikeDislikeService, EventLikeDislikeDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class EventLikeDislikeResolve implements Resolve<EventLikeDislike> {
  constructor(private service: EventLikeDislikeService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<EventLikeDislike> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<EventLikeDislike>) => response.ok),
        map((eventLikeDislike: HttpResponse<EventLikeDislike>) => eventLikeDislike.body)
      );
    }
    return of(new EventLikeDislike());
  }
}

const routes: Routes = [
  {
    path: '',
    component: EventLikeDislikePage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EventLikeDislikeUpdatePage,
    resolve: {
      data: EventLikeDislikeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EventLikeDislikeDetailPage,
    resolve: {
      data: EventLikeDislikeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EventLikeDislikeUpdatePage,
    resolve: {
      data: EventLikeDislikeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [EventLikeDislikePage, EventLikeDislikeUpdatePage, EventLikeDislikeDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class EventLikeDislikePageModule {}
