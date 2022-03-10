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

import { ServiceMapPage } from './service-map';
import { ServiceMapUpdatePage } from './service-map-update';
import { ServiceMap, ServiceMapService, ServiceMapDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class ServiceMapResolve implements Resolve<ServiceMap> {
  constructor(private service: ServiceMapService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ServiceMap> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<ServiceMap>) => response.ok),
        map((serviceMap: HttpResponse<ServiceMap>) => serviceMap.body)
      );
    }
    return of(new ServiceMap());
  }
}

const routes: Routes = [
  {
    path: '',
    component: ServiceMapPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ServiceMapUpdatePage,
    resolve: {
      data: ServiceMapResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ServiceMapDetailPage,
    resolve: {
      data: ServiceMapResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ServiceMapUpdatePage,
    resolve: {
      data: ServiceMapResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [ServiceMapPage, ServiceMapUpdatePage, ServiceMapDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class ServiceMapPageModule {}
