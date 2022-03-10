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

import { EventServiceMapOrderPage } from './event-service-map-order';
import { EventServiceMapOrderUpdatePage } from './event-service-map-order-update';
import { EventServiceMapOrder, EventServiceMapOrderService, EventServiceMapOrderDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class EventServiceMapOrderResolve implements Resolve<EventServiceMapOrder> {
  constructor(private service: EventServiceMapOrderService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<EventServiceMapOrder> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<EventServiceMapOrder>) => response.ok),
        map((eventServiceMapOrder: HttpResponse<EventServiceMapOrder>) => eventServiceMapOrder.body)
      );
    }
    return of(new EventServiceMapOrder());
  }
}

const routes: Routes = [
  {
    path: '',
    component: EventServiceMapOrderPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EventServiceMapOrderUpdatePage,
    resolve: {
      data: EventServiceMapOrderResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EventServiceMapOrderDetailPage,
    resolve: {
      data: EventServiceMapOrderResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EventServiceMapOrderUpdatePage,
    resolve: {
      data: EventServiceMapOrderResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [EventServiceMapOrderPage, EventServiceMapOrderUpdatePage, EventServiceMapOrderDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class EventServiceMapOrderPageModule {}
