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

import { CreateYourEventServicePage } from './create-your-event-service';
import { CreateYourEventServiceUpdatePage } from './create-your-event-service-update';
import { CreateYourEventService, CreateYourEventServiceService, CreateYourEventServiceDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class CreateYourEventServiceResolve implements Resolve<CreateYourEventService> {
  constructor(private service: CreateYourEventServiceService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CreateYourEventService> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<CreateYourEventService>) => response.ok),
        map((createYourEventService: HttpResponse<CreateYourEventService>) => createYourEventService.body)
      );
    }
    return of(new CreateYourEventService());
  }
}

const routes: Routes = [
  {
    path: '',
    component: CreateYourEventServicePage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CreateYourEventServiceUpdatePage,
    resolve: {
      data: CreateYourEventServiceResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CreateYourEventServiceDetailPage,
    resolve: {
      data: CreateYourEventServiceResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CreateYourEventServiceUpdatePage,
    resolve: {
      data: CreateYourEventServiceResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [CreateYourEventServicePage, CreateYourEventServiceUpdatePage, CreateYourEventServiceDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
  providers: [Camera],
})
export class CreateYourEventServicePageModule {}
