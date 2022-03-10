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

import { OrganizationReservationPage } from './organization-reservation';
import { OrganizationReservationUpdatePage } from './organization-reservation-update';
import { OrganizationReservation, OrganizationReservationService, OrganizationReservationDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class OrganizationReservationResolve implements Resolve<OrganizationReservation> {
  constructor(private service: OrganizationReservationService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<OrganizationReservation> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<OrganizationReservation>) => response.ok),
        map((organizationReservation: HttpResponse<OrganizationReservation>) => organizationReservation.body)
      );
    }
    return of(new OrganizationReservation());
  }
}

const routes: Routes = [
  {
    path: '',
    component: OrganizationReservationPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OrganizationReservationUpdatePage,
    resolve: {
      data: OrganizationReservationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OrganizationReservationDetailPage,
    resolve: {
      data: OrganizationReservationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OrganizationReservationUpdatePage,
    resolve: {
      data: OrganizationReservationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [OrganizationReservationPage, OrganizationReservationUpdatePage, OrganizationReservationDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class OrganizationReservationPageModule {}
