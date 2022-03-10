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

import { OrganizationCommentPage } from './organization-comment';
import { OrganizationCommentUpdatePage } from './organization-comment-update';
import { OrganizationComment, OrganizationCommentService, OrganizationCommentDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class OrganizationCommentResolve implements Resolve<OrganizationComment> {
  constructor(private service: OrganizationCommentService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<OrganizationComment> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<OrganizationComment>) => response.ok),
        map((organizationComment: HttpResponse<OrganizationComment>) => organizationComment.body)
      );
    }
    return of(new OrganizationComment());
  }
}

const routes: Routes = [
  {
    path: '',
    component: OrganizationCommentPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OrganizationCommentUpdatePage,
    resolve: {
      data: OrganizationCommentResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OrganizationCommentDetailPage,
    resolve: {
      data: OrganizationCommentResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OrganizationCommentUpdatePage,
    resolve: {
      data: OrganizationCommentResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [OrganizationCommentPage, OrganizationCommentUpdatePage, OrganizationCommentDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class OrganizationCommentPageModule {}
