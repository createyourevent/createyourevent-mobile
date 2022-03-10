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

import { EventCommentPage } from './event-comment';
import { EventCommentUpdatePage } from './event-comment-update';
import { EventComment, EventCommentService, EventCommentDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class EventCommentResolve implements Resolve<EventComment> {
  constructor(private service: EventCommentService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<EventComment> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<EventComment>) => response.ok),
        map((eventComment: HttpResponse<EventComment>) => eventComment.body)
      );
    }
    return of(new EventComment());
  }
}

const routes: Routes = [
  {
    path: '',
    component: EventCommentPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EventCommentUpdatePage,
    resolve: {
      data: EventCommentResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EventCommentDetailPage,
    resolve: {
      data: EventCommentResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EventCommentUpdatePage,
    resolve: {
      data: EventCommentResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [EventCommentPage, EventCommentUpdatePage, EventCommentDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class EventCommentPageModule {}
