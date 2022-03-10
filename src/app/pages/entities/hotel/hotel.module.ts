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

import { HotelPage } from './hotel';
import { HotelUpdatePage } from './hotel-update';
import { Hotel, HotelService, HotelDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class HotelResolve implements Resolve<Hotel> {
  constructor(private service: HotelService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Hotel> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Hotel>) => response.ok),
        map((hotel: HttpResponse<Hotel>) => hotel.body)
      );
    }
    return of(new Hotel());
  }
}

const routes: Routes = [
  {
    path: '',
    component: HotelPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: HotelUpdatePage,
    resolve: {
      data: HotelResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: HotelDetailPage,
    resolve: {
      data: HotelResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: HotelUpdatePage,
    resolve: {
      data: HotelResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [HotelPage, HotelUpdatePage, HotelDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class HotelPageModule {}
