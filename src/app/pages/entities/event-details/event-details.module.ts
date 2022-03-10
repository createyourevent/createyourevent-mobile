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

import { EventDetailsPage } from './event-details';
import { EventDetailsUpdatePage } from './event-details-update';
import { EventDetails, EventDetailsService, EventDetailsDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class EventDetailsResolve implements Resolve<EventDetails> {
  constructor(private service: EventDetailsService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<EventDetails> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<EventDetails>) => response.ok),
        map((eventDetails: HttpResponse<EventDetails>) => eventDetails.body)
      );
    }
    return of(new EventDetails());
  }
}

const routes: Routes = [
  {
    path: '',
    component: EventDetailsPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EventDetailsUpdatePage,
    resolve: {
      data: EventDetailsResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EventDetailsDetailPage,
    resolve: {
      data: EventDetailsResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EventDetailsUpdatePage,
    resolve: {
      data: EventDetailsResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [EventDetailsPage, EventDetailsUpdatePage, EventDetailsDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class EventDetailsPageModule {}
