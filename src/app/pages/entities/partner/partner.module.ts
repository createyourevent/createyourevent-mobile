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

import { PartnerPage } from './partner';
import { PartnerUpdatePage } from './partner-update';
import { Partner, PartnerService, PartnerDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class PartnerResolve implements Resolve<Partner> {
  constructor(private service: PartnerService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Partner> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Partner>) => response.ok),
        map((partner: HttpResponse<Partner>) => partner.body)
      );
    }
    return of(new Partner());
  }
}

const routes: Routes = [
  {
    path: '',
    component: PartnerPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PartnerUpdatePage,
    resolve: {
      data: PartnerResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PartnerDetailPage,
    resolve: {
      data: PartnerResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PartnerUpdatePage,
    resolve: {
      data: PartnerResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [PartnerPage, PartnerUpdatePage, PartnerDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
  providers: [Camera],
})
export class PartnerPageModule {}
