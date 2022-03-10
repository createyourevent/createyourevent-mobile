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

import { SlotListPlumPage } from './slot-list-plum';
import { SlotListPlumUpdatePage } from './slot-list-plum-update';
import { SlotListPlum, SlotListPlumService, SlotListPlumDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class SlotListPlumResolve implements Resolve<SlotListPlum> {
  constructor(private service: SlotListPlumService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SlotListPlum> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<SlotListPlum>) => response.ok),
        map((slotListPlum: HttpResponse<SlotListPlum>) => slotListPlum.body)
      );
    }
    return of(new SlotListPlum());
  }
}

const routes: Routes = [
  {
    path: '',
    component: SlotListPlumPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SlotListPlumUpdatePage,
    resolve: {
      data: SlotListPlumResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SlotListPlumDetailPage,
    resolve: {
      data: SlotListPlumResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SlotListPlumUpdatePage,
    resolve: {
      data: SlotListPlumResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [SlotListPlumPage, SlotListPlumUpdatePage, SlotListPlumDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class SlotListPlumPageModule {}
