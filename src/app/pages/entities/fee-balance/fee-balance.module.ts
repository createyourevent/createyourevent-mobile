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

import { FeeBalancePage } from './fee-balance';
import { FeeBalanceUpdatePage } from './fee-balance-update';
import { FeeBalance, FeeBalanceService, FeeBalanceDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class FeeBalanceResolve implements Resolve<FeeBalance> {
  constructor(private service: FeeBalanceService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FeeBalance> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<FeeBalance>) => response.ok),
        map((feeBalance: HttpResponse<FeeBalance>) => feeBalance.body)
      );
    }
    return of(new FeeBalance());
  }
}

const routes: Routes = [
  {
    path: '',
    component: FeeBalancePage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FeeBalanceUpdatePage,
    resolve: {
      data: FeeBalanceResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FeeBalanceDetailPage,
    resolve: {
      data: FeeBalanceResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FeeBalanceUpdatePage,
    resolve: {
      data: FeeBalanceResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [FeeBalancePage, FeeBalanceUpdatePage, FeeBalanceDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class FeeBalancePageModule {}
