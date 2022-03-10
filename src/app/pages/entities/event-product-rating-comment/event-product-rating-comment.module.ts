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

import { EventProductRatingCommentPage } from './event-product-rating-comment';
import { EventProductRatingCommentUpdatePage } from './event-product-rating-comment-update';
import { EventProductRatingComment, EventProductRatingCommentService, EventProductRatingCommentDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class EventProductRatingCommentResolve implements Resolve<EventProductRatingComment> {
  constructor(private service: EventProductRatingCommentService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<EventProductRatingComment> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<EventProductRatingComment>) => response.ok),
        map((eventProductRatingComment: HttpResponse<EventProductRatingComment>) => eventProductRatingComment.body)
      );
    }
    return of(new EventProductRatingComment());
  }
}

const routes: Routes = [
  {
    path: '',
    component: EventProductRatingCommentPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EventProductRatingCommentUpdatePage,
    resolve: {
      data: EventProductRatingCommentResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EventProductRatingCommentDetailPage,
    resolve: {
      data: EventProductRatingCommentResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EventProductRatingCommentUpdatePage,
    resolve: {
      data: EventProductRatingCommentResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [EventProductRatingCommentPage, EventProductRatingCommentUpdatePage, EventProductRatingCommentDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class EventProductRatingCommentPageModule {}
