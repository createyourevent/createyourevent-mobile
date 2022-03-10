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

import { FeeTransactionEntryPage } from './fee-transaction-entry';
import { FeeTransactionEntryUpdatePage } from './fee-transaction-entry-update';
import { FeeTransactionEntry, FeeTransactionEntryService, FeeTransactionEntryDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class FeeTransactionEntryResolve implements Resolve<FeeTransactionEntry> {
  constructor(private service: FeeTransactionEntryService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FeeTransactionEntry> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<FeeTransactionEntry>) => response.ok),
        map((feeTransactionEntry: HttpResponse<FeeTransactionEntry>) => feeTransactionEntry.body)
      );
    }
    return of(new FeeTransactionEntry());
  }
}

const routes: Routes = [
  {
    path: '',
    component: FeeTransactionEntryPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FeeTransactionEntryUpdatePage,
    resolve: {
      data: FeeTransactionEntryResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FeeTransactionEntryDetailPage,
    resolve: {
      data: FeeTransactionEntryResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FeeTransactionEntryUpdatePage,
    resolve: {
      data: FeeTransactionEntryResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [FeeTransactionEntryPage, FeeTransactionEntryUpdatePage, FeeTransactionEntryDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class FeeTransactionEntryPageModule {}
