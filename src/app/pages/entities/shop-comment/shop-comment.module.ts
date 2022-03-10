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

import { ShopCommentPage } from './shop-comment';
import { ShopCommentUpdatePage } from './shop-comment-update';
import { ShopComment, ShopCommentService, ShopCommentDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class ShopCommentResolve implements Resolve<ShopComment> {
  constructor(private service: ShopCommentService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ShopComment> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<ShopComment>) => response.ok),
        map((shopComment: HttpResponse<ShopComment>) => shopComment.body)
      );
    }
    return of(new ShopComment());
  }
}

const routes: Routes = [
  {
    path: '',
    component: ShopCommentPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ShopCommentUpdatePage,
    resolve: {
      data: ShopCommentResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ShopCommentDetailPage,
    resolve: {
      data: ShopCommentResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ShopCommentUpdatePage,
    resolve: {
      data: ShopCommentResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [ShopCommentPage, ShopCommentUpdatePage, ShopCommentDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class ShopCommentPageModule {}
