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

import { ServiceCommentPage } from './service-comment';
import { ServiceCommentUpdatePage } from './service-comment-update';
import { ServiceComment, ServiceCommentService, ServiceCommentDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class ServiceCommentResolve implements Resolve<ServiceComment> {
  constructor(private service: ServiceCommentService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ServiceComment> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<ServiceComment>) => response.ok),
        map((serviceComment: HttpResponse<ServiceComment>) => serviceComment.body)
      );
    }
    return of(new ServiceComment());
  }
}

const routes: Routes = [
  {
    path: '',
    component: ServiceCommentPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ServiceCommentUpdatePage,
    resolve: {
      data: ServiceCommentResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ServiceCommentDetailPage,
    resolve: {
      data: ServiceCommentResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ServiceCommentUpdatePage,
    resolve: {
      data: ServiceCommentResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [ServiceCommentPage, ServiceCommentUpdatePage, ServiceCommentDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class ServiceCommentPageModule {}
