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

import { RideCostsPage } from './ride-costs';
import { RideCostsUpdatePage } from './ride-costs-update';
import { RideCosts, RideCostsService, RideCostsDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class RideCostsResolve implements Resolve<RideCosts> {
  constructor(private service: RideCostsService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RideCosts> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<RideCosts>) => response.ok),
        map((rideCosts: HttpResponse<RideCosts>) => rideCosts.body)
      );
    }
    return of(new RideCosts());
  }
}

const routes: Routes = [
  {
    path: '',
    component: RideCostsPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RideCostsUpdatePage,
    resolve: {
      data: RideCostsResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RideCostsDetailPage,
    resolve: {
      data: RideCostsResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RideCostsUpdatePage,
    resolve: {
      data: RideCostsResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [RideCostsPage, RideCostsUpdatePage, RideCostsDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class RideCostsPageModule {}
