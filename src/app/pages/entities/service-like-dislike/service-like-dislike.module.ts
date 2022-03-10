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

import { ServiceLikeDislikePage } from './service-like-dislike';
import { ServiceLikeDislikeUpdatePage } from './service-like-dislike-update';
import { ServiceLikeDislike, ServiceLikeDislikeService, ServiceLikeDislikeDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class ServiceLikeDislikeResolve implements Resolve<ServiceLikeDislike> {
  constructor(private service: ServiceLikeDislikeService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ServiceLikeDislike> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<ServiceLikeDislike>) => response.ok),
        map((serviceLikeDislike: HttpResponse<ServiceLikeDislike>) => serviceLikeDislike.body)
      );
    }
    return of(new ServiceLikeDislike());
  }
}

const routes: Routes = [
  {
    path: '',
    component: ServiceLikeDislikePage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ServiceLikeDislikeUpdatePage,
    resolve: {
      data: ServiceLikeDislikeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ServiceLikeDislikeDetailPage,
    resolve: {
      data: ServiceLikeDislikeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ServiceLikeDislikeUpdatePage,
    resolve: {
      data: ServiceLikeDislikeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [ServiceLikeDislikePage, ServiceLikeDislikeUpdatePage, ServiceLikeDislikeDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class ServiceLikeDislikePageModule {}
