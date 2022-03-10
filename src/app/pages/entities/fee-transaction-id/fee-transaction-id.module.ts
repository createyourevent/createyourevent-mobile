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

import { FeeTransactionIdPage } from './fee-transaction-id';
import { FeeTransactionIdUpdatePage } from './fee-transaction-id-update';
import { FeeTransactionId, FeeTransactionIdService, FeeTransactionIdDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class FeeTransactionIdResolve implements Resolve<FeeTransactionId> {
  constructor(private service: FeeTransactionIdService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FeeTransactionId> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<FeeTransactionId>) => response.ok),
        map((feeTransactionId: HttpResponse<FeeTransactionId>) => feeTransactionId.body)
      );
    }
    return of(new FeeTransactionId());
  }
}

const routes: Routes = [
  {
    path: '',
    component: FeeTransactionIdPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FeeTransactionIdUpdatePage,
    resolve: {
      data: FeeTransactionIdResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FeeTransactionIdDetailPage,
    resolve: {
      data: FeeTransactionIdResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FeeTransactionIdUpdatePage,
    resolve: {
      data: FeeTransactionIdResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [FeeTransactionIdPage, FeeTransactionIdUpdatePage, FeeTransactionIdDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class FeeTransactionIdPageModule {}
