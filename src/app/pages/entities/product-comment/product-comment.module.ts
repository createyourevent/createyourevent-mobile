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

import { ProductCommentPage } from './product-comment';
import { ProductCommentUpdatePage } from './product-comment-update';
import { ProductComment, ProductCommentService, ProductCommentDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class ProductCommentResolve implements Resolve<ProductComment> {
  constructor(private service: ProductCommentService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ProductComment> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<ProductComment>) => response.ok),
        map((productComment: HttpResponse<ProductComment>) => productComment.body)
      );
    }
    return of(new ProductComment());
  }
}

const routes: Routes = [
  {
    path: '',
    component: ProductCommentPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProductCommentUpdatePage,
    resolve: {
      data: ProductCommentResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProductCommentDetailPage,
    resolve: {
      data: ProductCommentResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProductCommentUpdatePage,
    resolve: {
      data: ProductCommentResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [ProductCommentPage, ProductCommentUpdatePage, ProductCommentDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class ProductCommentPageModule {}
