import { NgModule, Injectable } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { Camera } from '@ionic-native/camera/ngx';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserRouteAccessService } from '../../../services/auth/user-route-access.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';

import { GiftPage } from './gift';
import { GiftUpdatePage } from './gift-update';
import { Gift, GiftService, GiftDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class GiftResolve implements Resolve<Gift> {
  constructor(private service: GiftService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Gift> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Gift>) => response.ok),
        map((gift: HttpResponse<Gift>) => gift.body)
      );
    }
    return of(new Gift());
  }
}

const routes: Routes = [
  {
    path: '',
    component: GiftPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GiftUpdatePage,
    resolve: {
      data: GiftResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GiftDetailPage,
    resolve: {
      data: GiftResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GiftUpdatePage,
    resolve: {
      data: GiftResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [GiftPage, GiftUpdatePage, GiftDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
  providers: [Camera],
})
export class GiftPageModule {}
