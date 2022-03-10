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

import { ServiceOfferPage } from './service-offer';
import { ServiceOfferUpdatePage } from './service-offer-update';
import { ServiceOffer, ServiceOfferService, ServiceOfferDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class ServiceOfferResolve implements Resolve<ServiceOffer> {
  constructor(private service: ServiceOfferService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ServiceOffer> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<ServiceOffer>) => response.ok),
        map((serviceOffer: HttpResponse<ServiceOffer>) => serviceOffer.body)
      );
    }
    return of(new ServiceOffer());
  }
}

const routes: Routes = [
  {
    path: '',
    component: ServiceOfferPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ServiceOfferUpdatePage,
    resolve: {
      data: ServiceOfferResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ServiceOfferDetailPage,
    resolve: {
      data: ServiceOfferResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ServiceOfferUpdatePage,
    resolve: {
      data: ServiceOfferResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [ServiceOfferPage, ServiceOfferUpdatePage, ServiceOfferDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class ServiceOfferPageModule {}
