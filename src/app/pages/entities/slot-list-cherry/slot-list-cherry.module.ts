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

import { SlotListCherryPage } from './slot-list-cherry';
import { SlotListCherryUpdatePage } from './slot-list-cherry-update';
import { SlotListCherry, SlotListCherryService, SlotListCherryDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class SlotListCherryResolve implements Resolve<SlotListCherry> {
  constructor(private service: SlotListCherryService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SlotListCherry> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<SlotListCherry>) => response.ok),
        map((slotListCherry: HttpResponse<SlotListCherry>) => slotListCherry.body)
      );
    }
    return of(new SlotListCherry());
  }
}

const routes: Routes = [
  {
    path: '',
    component: SlotListCherryPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SlotListCherryUpdatePage,
    resolve: {
      data: SlotListCherryResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SlotListCherryDetailPage,
    resolve: {
      data: SlotListCherryResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SlotListCherryUpdatePage,
    resolve: {
      data: SlotListCherryResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [SlotListCherryPage, SlotListCherryUpdatePage, SlotListCherryDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class SlotListCherryPageModule {}
