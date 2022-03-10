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

import { ReservationPage } from './reservation';
import { ReservationUpdatePage } from './reservation-update';
import { Reservation, ReservationService, ReservationDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class ReservationResolve implements Resolve<Reservation> {
  constructor(private service: ReservationService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Reservation> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Reservation>) => response.ok),
        map((reservation: HttpResponse<Reservation>) => reservation.body)
      );
    }
    return of(new Reservation());
  }
}

const routes: Routes = [
  {
    path: '',
    component: ReservationPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ReservationUpdatePage,
    resolve: {
      data: ReservationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ReservationDetailPage,
    resolve: {
      data: ReservationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ReservationUpdatePage,
    resolve: {
      data: ReservationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [ReservationPage, ReservationUpdatePage, ReservationDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class ReservationPageModule {}
