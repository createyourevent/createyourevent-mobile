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

import { UserExtensionPage } from './user-extension';
import { UserExtensionUpdatePage } from './user-extension-update';
import { UserExtension, UserExtensionService, UserExtensionDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class UserExtensionResolve implements Resolve<UserExtension> {
  constructor(private service: UserExtensionService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UserExtension> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<UserExtension>) => response.ok),
        map((userExtension: HttpResponse<UserExtension>) => userExtension.body)
      );
    }
    return of(new UserExtension());
  }
}

const routes: Routes = [
  {
    path: '',
    component: UserExtensionPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UserExtensionUpdatePage,
    resolve: {
      data: UserExtensionResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UserExtensionDetailPage,
    resolve: {
      data: UserExtensionResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UserExtensionUpdatePage,
    resolve: {
      data: UserExtensionResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [UserExtensionPage, UserExtensionUpdatePage, UserExtensionDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class UserExtensionPageModule {}
