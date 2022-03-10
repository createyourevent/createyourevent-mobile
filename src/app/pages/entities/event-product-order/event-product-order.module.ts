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

import { EventProductOrderPage } from './event-product-order';
import { EventProductOrderUpdatePage } from './event-product-order-update';
import { EventProductOrder, EventProductOrderService, EventProductOrderDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class EventProductOrderResolve implements Resolve<EventProductOrder> {
  constructor(private service: EventProductOrderService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<EventProductOrder> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<EventProductOrder>) => response.ok),
        map((eventProductOrder: HttpResponse<EventProductOrder>) => eventProductOrder.body)
      );
    }
    return of(new EventProductOrder());
  }
}

const routes: Routes = [
  {
    path: '',
    component: EventProductOrderPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EventProductOrderUpdatePage,
    resolve: {
      data: EventProductOrderResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EventProductOrderDetailPage,
    resolve: {
      data: EventProductOrderResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EventProductOrderUpdatePage,
    resolve: {
      data: EventProductOrderResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [EventProductOrderPage, EventProductOrderUpdatePage, EventProductOrderDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class EventProductOrderPageModule {}
