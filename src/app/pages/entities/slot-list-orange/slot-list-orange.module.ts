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

import { SlotListOrangePage } from './slot-list-orange';
import { SlotListOrangeUpdatePage } from './slot-list-orange-update';
import { SlotListOrange, SlotListOrangeService, SlotListOrangeDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class SlotListOrangeResolve implements Resolve<SlotListOrange> {
  constructor(private service: SlotListOrangeService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SlotListOrange> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<SlotListOrange>) => response.ok),
        map((slotListOrange: HttpResponse<SlotListOrange>) => slotListOrange.body)
      );
    }
    return of(new SlotListOrange());
  }
}

const routes: Routes = [
  {
    path: '',
    component: SlotListOrangePage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SlotListOrangeUpdatePage,
    resolve: {
      data: SlotListOrangeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SlotListOrangeDetailPage,
    resolve: {
      data: SlotListOrangeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SlotListOrangeUpdatePage,
    resolve: {
      data: SlotListOrangeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [SlotListOrangePage, SlotListOrangeUpdatePage, SlotListOrangeDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class SlotListOrangePageModule {}
