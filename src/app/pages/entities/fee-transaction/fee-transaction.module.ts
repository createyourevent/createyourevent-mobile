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

import { FeeTransactionPage } from './fee-transaction';
import { FeeTransactionUpdatePage } from './fee-transaction-update';
import { FeeTransaction, FeeTransactionService, FeeTransactionDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class FeeTransactionResolve implements Resolve<FeeTransaction> {
  constructor(private service: FeeTransactionService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FeeTransaction> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<FeeTransaction>) => response.ok),
        map((feeTransaction: HttpResponse<FeeTransaction>) => feeTransaction.body)
      );
    }
    return of(new FeeTransaction());
  }
}

const routes: Routes = [
  {
    path: '',
    component: FeeTransactionPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FeeTransactionUpdatePage,
    resolve: {
      data: FeeTransactionResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FeeTransactionDetailPage,
    resolve: {
      data: FeeTransactionResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FeeTransactionUpdatePage,
    resolve: {
      data: FeeTransactionResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [FeeTransactionPage, FeeTransactionUpdatePage, FeeTransactionDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class FeeTransactionPageModule {}
