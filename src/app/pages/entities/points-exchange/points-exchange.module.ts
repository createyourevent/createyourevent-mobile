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

import { PointsExchangePage } from './points-exchange';
import { PointsExchangeUpdatePage } from './points-exchange-update';
import { PointsExchange, PointsExchangeService, PointsExchangeDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class PointsExchangeResolve implements Resolve<PointsExchange> {
  constructor(private service: PointsExchangeService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PointsExchange> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<PointsExchange>) => response.ok),
        map((pointsExchange: HttpResponse<PointsExchange>) => pointsExchange.body)
      );
    }
    return of(new PointsExchange());
  }
}

const routes: Routes = [
  {
    path: '',
    component: PointsExchangePage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PointsExchangeUpdatePage,
    resolve: {
      data: PointsExchangeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PointsExchangeDetailPage,
    resolve: {
      data: PointsExchangeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PointsExchangeUpdatePage,
    resolve: {
      data: PointsExchangeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [PointsExchangePage, PointsExchangeUpdatePage, PointsExchangeDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class PointsExchangePageModule {}
