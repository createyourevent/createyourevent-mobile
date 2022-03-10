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

import { ReservationTransactionIdPage } from './reservation-transaction-id';
import { ReservationTransactionIdUpdatePage } from './reservation-transaction-id-update';
import { ReservationTransactionId, ReservationTransactionIdService, ReservationTransactionIdDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class ReservationTransactionIdResolve implements Resolve<ReservationTransactionId> {
  constructor(private service: ReservationTransactionIdService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ReservationTransactionId> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<ReservationTransactionId>) => response.ok),
        map((reservationTransactionId: HttpResponse<ReservationTransactionId>) => reservationTransactionId.body)
      );
    }
    return of(new ReservationTransactionId());
  }
}

const routes: Routes = [
  {
    path: '',
    component: ReservationTransactionIdPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ReservationTransactionIdUpdatePage,
    resolve: {
      data: ReservationTransactionIdResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ReservationTransactionIdDetailPage,
    resolve: {
      data: ReservationTransactionIdResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ReservationTransactionIdUpdatePage,
    resolve: {
      data: ReservationTransactionIdResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [ReservationTransactionIdPage, ReservationTransactionIdUpdatePage, ReservationTransactionIdDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class ReservationTransactionIdPageModule {}
