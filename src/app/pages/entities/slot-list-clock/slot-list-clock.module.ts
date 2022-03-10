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

import { SlotListClockPage } from './slot-list-clock';
import { SlotListClockUpdatePage } from './slot-list-clock-update';
import { SlotListClock, SlotListClockService, SlotListClockDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class SlotListClockResolve implements Resolve<SlotListClock> {
  constructor(private service: SlotListClockService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SlotListClock> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<SlotListClock>) => response.ok),
        map((slotListClock: HttpResponse<SlotListClock>) => slotListClock.body)
      );
    }
    return of(new SlotListClock());
  }
}

const routes: Routes = [
  {
    path: '',
    component: SlotListClockPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SlotListClockUpdatePage,
    resolve: {
      data: SlotListClockResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SlotListClockDetailPage,
    resolve: {
      data: SlotListClockResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SlotListClockUpdatePage,
    resolve: {
      data: SlotListClockResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [SlotListClockPage, SlotListClockUpdatePage, SlotListClockDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class SlotListClockPageModule {}
