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

import { DeliveryTypePage } from './delivery-type';
import { DeliveryTypeUpdatePage } from './delivery-type-update';
import { DeliveryType, DeliveryTypeService, DeliveryTypeDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class DeliveryTypeResolve implements Resolve<DeliveryType> {
  constructor(private service: DeliveryTypeService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<DeliveryType> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<DeliveryType>) => response.ok),
        map((deliveryType: HttpResponse<DeliveryType>) => deliveryType.body)
      );
    }
    return of(new DeliveryType());
  }
}

const routes: Routes = [
  {
    path: '',
    component: DeliveryTypePage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DeliveryTypeUpdatePage,
    resolve: {
      data: DeliveryTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DeliveryTypeDetailPage,
    resolve: {
      data: DeliveryTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DeliveryTypeUpdatePage,
    resolve: {
      data: DeliveryTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [DeliveryTypePage, DeliveryTypeUpdatePage, DeliveryTypeDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class DeliveryTypePageModule {}
