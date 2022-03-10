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

import { PointPage } from './point';
import { PointUpdatePage } from './point-update';
import { Point, PointService, PointDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class PointResolve implements Resolve<Point> {
  constructor(private service: PointService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Point> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Point>) => response.ok),
        map((point: HttpResponse<Point>) => point.body)
      );
    }
    return of(new Point());
  }
}

const routes: Routes = [
  {
    path: '',
    component: PointPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PointUpdatePage,
    resolve: {
      data: PointResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PointDetailPage,
    resolve: {
      data: PointResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PointUpdatePage,
    resolve: {
      data: PointResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [PointPage, PointUpdatePage, PointDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class PointPageModule {}
